package gov.va.cpe.jrebel;

import gov.va.cpe.vpr.frameeng.FrameRegistry;

import org.zeroturnaround.javarebel.ClassEventListener;
import org.zeroturnaround.javarebel.ClassResourceSource;
import org.zeroturnaround.javarebel.LoggerFactory;
import org.zeroturnaround.javarebel.Plugin;
import org.zeroturnaround.javarebel.Reloader;
import org.zeroturnaround.javarebel.ReloaderFactory;

/**
 * First crack at a JRebel plugin that will dynamically refresh the frame library when a frame is updated.
 * 
 * Caveats: 
 * TODO: Only frames from the spring bean loader work
 * TODO: SpringBean frames must have @@Scope("prototype") otherwise spring does not reload the bean.
 * TODO: For some reason, you have to refresh *TWICE*.  Not sure why yet.
 * @author brian
 */
public class JRebelFramePlugin implements Plugin {
	public void preinit() {
		Reloader reloader = ReloaderFactory.getInstance();
		reloader.addClassReloadListener(new ClassEventListener() {
			public void onClassEvent(int eventType, Class clazz) {
				try {
					Class frameClass = Class.forName("gov.va.cpe.vpr.frameeng.IFrame");
					
					// Check if it is child of AbstractCanvas
					if (frameClass.isAssignableFrom(clazz)) {
						FrameRegistry.reload(clazz);
						LoggerFactory.getInstance().echo("Refreshed the FrameLoader");
					}
				} catch (Exception e) {
					LoggerFactory.getInstance().error(e);
					System.out.println(e);
				}
			}

			public int priority() {
				return 0;
			}
		});
	}
	
	public boolean checkDependencies(ClassLoader classLoader, ClassResourceSource classResourceSource) {
		return classResourceSource.getClassResource("gov.va.cpe.vpr.frameeng.IFrame") != null;
	}

	public String getId() {
		return "hmp-jrebel-plugin";
	}

	public String getName() {
		return "HMP JRebel Plugin";
	}

	public String getDescription() {
		return "Modified frames classes are reloaded.";
	}

	public String getAuthor() {
		return null;
	}

	public String getWebsite() {
		return null;
	}

	public String getSupportedVersions() {
		return null;
	}

	public String getTestedVersions() {
		return null;
	}
}

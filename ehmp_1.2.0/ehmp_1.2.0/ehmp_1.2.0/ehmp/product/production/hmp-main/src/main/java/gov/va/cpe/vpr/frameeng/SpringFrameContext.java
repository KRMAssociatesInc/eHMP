package gov.va.cpe.vpr.frameeng;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class SpringFrameContext extends FrameContext implements ApplicationContextAware {
	protected ApplicationContext ctx;

	@Override
	public <T> T getResource(Class<T> clazz, String name) {
		T ret = null;
		if (this.ctx == null) {
			ret = super.getResource(clazz, name);
		} else if (clazz == ApplicationContext.class) {
			return (T) this.ctx;
		} else if (clazz != null && name != null) {
			ret = this.ctx.getBean(name, clazz);
		} else if (name != null) {
			ret = (T) this.ctx.getBean(name);
		} else {
			ret = this.ctx.getBean(clazz);
		}
		return ret;
	}

	@Override
	public void setApplicationContext(ApplicationContext ctx) throws BeansException {
		this.ctx = ctx;
	}
}
program RPCSharedBrokerSessionMgr2;

uses
  Forms,
  uSharedBroker1 in 'uSharedBroker1.pas' {SharedBroker: CoClass},
  fVistaBar in 'fVistaBar.pas' {frmVistABar},
  fDebugInfo in 'fDebugInfo.pas' {frmDebugInfo};

{$R *.TLB}

begin
  Application.Initialize;
  Application.CreateForm(TfrmVistABar, frmVistABar);
  Application.CreateForm(TfrmDebugInfo, frmDebugInfo);
  Application.Run;
end.

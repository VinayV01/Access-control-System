from .models import AuditLog

def create_audit_log(actor, action, metadata=None):
    AuditLog.objects.create(
        actor=actor,
        action=action,
        metadata=metadata or {}
    )

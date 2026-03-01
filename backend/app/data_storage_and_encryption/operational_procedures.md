# Operational Procedures: Data Storage & Encryption

This document outlines the procedures for managing encryption keys, backups, and data deletion in Psynova.

## 1. Key Management & Rotation

### Key Storage
- **Development**: Environment variables (`ENCRYPTION_MASTER_KEY`).
- **Production**: Keys must be stored in an HSM (Hardware Security Module) or a managed service like **AWS KMS** or **Azure Key Vault**.

### Rotation Policy
- Keys should be rotated every **12 months** or immediately upon individual access revocation of an infrastructure admin.
- **Process**:
    1. Generate a new master key.
    2. Update the application to use the new key for **new** encryptions.
    3. Retain the old key for decryption only during the migration window (**max 90 days**).
    4. **Mandatory Migration**: Trigger an automated background job to re-encrypt all legacy data with the new key. Verify completion and retire the old key before the 90-day deadline.

---

## 2. Backup Strategy

### Frequency & Type
- **Daily Full Backups**: Encrypted database dumps.
- **Point-in-Time Recovery (PITR)**: Enabled for production clusters to allow recovery to any second within the last 7 days.

### Encryption
- All backups must be encrypted at rest using provider-managed keys (e.g., MongoDB Atlas Encryption at Rest).

### Restoration Test
- Monthly automated tests to restore a backup to a staging environment to ensure data integrity.

---

## 3. Data Retention & Deletion

### Right to be Forgotten (GDPR Compliance)
- When a user requests deletion:
    - **GDPR Article 17 Erasure**: Triggers **immediate hard deletion** by default.
    - **Hard Delete**: All PII and sensitive fields are physically removed. Prefer full document deletion (including `_id`) to avoid residual linkage.
    - **Internal Soft Delete**: The 30-day "is_deleted" window is an internal retention override only for non-GDPR flows.
    - **Backups**: Deleted data may persist in backups for **30–90 days** (GDPR Recital 65). This is a short-term residual risk for disaster recovery only. Backups are protected by strict access controls and will be restored only to live systems to follow erasure requests followed by permanent deletion.

### Audit Log Governance
1. **Legal Basis**: Retention for 2–3 years per GDPR Article 17(3)(b) for legal defense/compliance.
2. **Access Control**: RBAC-restricted access. Only authorized security auditors may view logs.
3. **Protection**: Encrypted at rest and in transit.
4. **Pseudonymization**: User identifiers in logs must be hashed/pseudonymized where possible. Reversible mapping is allowed only when legally necessary.
5. **Archival**: Automated permanent deletion of logs after the retention period.

### Logging
- All deletions of sensitive data must be recorded in the audit log (who initiated, when, and record ID).

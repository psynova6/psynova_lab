# Operational Procedures: Data Storage & Encryption

This document outlines the procedures for managing encryption keys, backups, and data deletion in Psynova.

## 1. Key Management & Rotation

### Key Storage
- **Development**: Environment variables (`ENCRYPTION_MASTER_KEY`).
- **Production**: Keys must be stored in a HSM (Hardware Security Module) or a managed service like **AWS KMS** or **Azure Key Vault**.

### Rotation Policy
- Keys should be rotated every **12 months** or immediately upon individual access revocation of an infrastructure admin.
- **Process**:
    1. Generate a new master key.
    2. Update the application to use the new key for **new** encryptions.
    3. Retain the old key for decrypting existing data.
    4. (Optional) Run a background migration script to re-encrypt old data with the new key.

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
    - **Soft Delete**: Mark `is_deleted: true`. Data remains for 30 days.
    - **Hard Delete**: After 30 days (or upon explicit request), all PII and sensitive fields are physically removed from the database ($unset or delete document).
    - **Backups**: Data will naturally expire from backups according to the rotation policy (e.g., after 30-90 days).

### Logging
- All deletions of sensitive data must be logged for audit purposes (who initiated, when, and which user ID was affected).

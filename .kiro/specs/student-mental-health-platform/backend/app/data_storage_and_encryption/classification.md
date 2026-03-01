# Data Classification Table

This table defines the sensitivity levels for data stored in Psynova and the required protection measures.

| Classification | Description | Examples | Protection Measures |
| :--- | :--- | :--- | :--- |
| **Public** | Information that can be freely shared. | App version, public FAQ, generic help docs. | None (standard SSL/TLS for transit). |
| **Internal** | Non-sensitive data for system operation. | Institution IDs, system timestamps. | Access control via JWT. |
| **Sensitive** | PII and Pseudonymous Identifiers. | **User IDs**, emails, phone numbers. | **MANDATORY** at-rest encryption, access logging and strict key management. |
| **Highly Sensitive** | Protected Health Information (PHI) & Private Comms. | Chat messages, clinician notes, mental health assessments. | **Mandatory** application-layer encryption (AES-256-GCM) AND mandatory audit logging. |

> [!IMPORTANT]
> **Audit Logging Requirement**: All read/write access to Highly Sensitive fields must be recorded, including actor, timestamp, record ID, and operation type.
> 
> **Personal Data Note**: Any identifier (like User IDs) that can link to PHI must be handled with Sensitive protections: no free logging, no exposure in error responses, and restricted access.

## Data Treatment for Highly Sensitive Fields

All fields classified as **Highly Sensitive** MUST be encrypted before being stored in the database.

- **Storage**: Encrypted blob (Base64 string) containing `[nonce][ciphertext][tag]`.
- **Encryption Algorithm**: AES-256-GCM.
- **IV/Nonce Requirements**: 
    - Use a unique 96-bit nonce per encryption operation.
    - **NEVER** reuse a nonce for the same key.
    - Nonces must be generated using a cryptographically secure random number generator (CSPRNG).
    - Persist the nonce alongside the ciphertext blob for decryption.
    - Verify the authentication tag on every decryption request.
- **Key Storage**: 
    - **Phase 1 (Hardened Baseline)**: Keys must be managed via secrets managers (e.g., AWS Secrets Manager, HashiCorp Vault). 
    - Environment-sourced keys must **never** be logged or serialized.
    - Access keys via secure wrappers only; avoid direct exposure of process environments.
    - **Rotation**: Mandatory annual key rotation with background re-encryption of legacy data.
    - **Phase 2**: AWS KMS / Azure Key Vault integration.

# Data Classification Table

This table defines the sensitivity levels for data stored in Psynova and the required protection measures.

| Classification | Description | Examples | Protection Measures |
| :--- | :--- | :--- | :--- |
| **Public** | Information that can be freely shared. | App version, public FAQ, generic help docs. | None (standard SSL/TLS for transit). |
| **Internal** | Non-sensitive data for system operation. | User IDs, institution IDs, timestamps. | Access control via JWT. |
| **Sensitive** | Personally Identifiable Information (PII). | Full names, emails, phone numbers. | At-rest encryption (optional but recommended), access logging. |
| **Highly Sensitive** | Protected Health Information (PHI) & Private Comms. | Chat messages, clinician notes, mental health assessments. | **Mandatory** application-layer encryption (AES-256-GCM). |

## Data Treatment for Highly Sensitive Fields

All fields classified as **Highly Sensitive** MUST be encrypted before being stored in the database.

- **Storage**: Encrypted blob (Base64 string).
- **Encryption Algorithm**: AES-256-GCM.
- **Key Storage**: Environment variables (Phase 1) -> AWS KMS / Azure Key Vault (Phase 2).

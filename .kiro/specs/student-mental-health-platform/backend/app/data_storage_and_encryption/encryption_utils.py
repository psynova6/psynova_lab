import logging
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.exceptions import InvalidTag
from typing import Optional
from app.config import settings

logger = logging.getLogger(__name__)

# Load and validate the master key from environment
ENV_KEY = os.getenv("ENCRYPTION_MASTER_KEY")
if not ENV_KEY:
    raise SystemExit("ENCRYPTION_MASTER_KEY environment variable is not set.")

try:
    MASTER_KEY = base64.b64decode(ENV_KEY)
    if len(MASTER_KEY) != 32:
        raise ValueError(f"Expected 32-byte key after decoding, got {len(MASTER_KEY)} bytes.")
except Exception as e:
    raise SystemExit(f"Invalid ENCRYPTION_MASTER_KEY: {e}")

aesgcm = AESGCM(MASTER_KEY)

def encrypt_field(data: Optional[str]) -> Optional[str]:
    """
    Encrypts a string field using AES-256-GCM.
    Returns a base64 encoded string containing [nonce][ciphertext].
    """
    if data is None:
        return None
        
    nonce = os.urandom(12)  # Recommended nonce size for GCM is 12 bytes
    ciphertext = aesgcm.encrypt(nonce, data.encode(), None)
    
    # Prepend nonce to ciphertext for storage
    encrypted_blob = nonce + ciphertext
    return base64.b64encode(encrypted_blob).decode('utf-8')

def decrypt_field(encrypted_data: Optional[str]) -> Optional[str]:
    """
    Decrypts a base64 encoded string using AES-256-GCM.
    Expects [nonce][ciphertext] format.
    """
    if encrypted_data is None:
        return None
        
    try:
        decoded_blob = base64.b64decode(encrypted_data.encode('utf-8'))
        nonce = decoded_blob[:12]
        ciphertext = decoded_blob[12:]
        
        decrypted_data = aesgcm.decrypt(nonce, ciphertext, None)
        return decrypted_data.decode('utf-8')
    except InvalidTag:
        logger.error("Decryption failed: Invalid tag (tampering detected)")
        raise
    except Exception as e:
        logger.error(f"Decryption failed: {e}")
        raise

if __name__ == "__main__":
    # Quick test
    original_text = "Highly sensitive health note."
    encrypted = encrypt_field(original_text)
    decrypted = decrypt_field(encrypted)
    
    print(f"Original: {original_text}")
    print(f"Encrypted: {encrypted}")
    print(f"Decrypted: {decrypted}")
    assert original_text == decrypted

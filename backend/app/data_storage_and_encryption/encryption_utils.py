import os
import base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from app.config import settings

# A 32-byte (256-bit) key is required for AES-256-GCM
# In a real production environment, this should be fetched from a Key Management Service (KMS)
MASTER_KEY = os.getenv("ENCRYPTION_MASTER_KEY", "default-32-byte-key-placeholder-1234")

# Ensure the key is exactly 32 bytes for AES-256
if len(MASTER_KEY.encode()) < 32:
    MASTER_KEY = MASTER_KEY.ljust(32, "0")[:32]
elif len(MASTER_KEY.encode()) > 32:
    MASTER_KEY = MASTER_KEY.encode()[:32].decode()

aesgcm = AESGCM(MASTER_KEY.encode())

def encrypt_field(data: str) -> str:
    """
    Encrypts a string field using AES-256-GCM.
    Returns a base64 encoded string containing [nonce][ciphertext].
    """
    if not data:
        return data
        
    nonce = os.urandom(12)  # Recommended nonce size for GCM is 12 bytes
    ciphertext = aesgcm.encrypt(nonce, data.encode(), None)
    
    # Prepend nonce to ciphertext for storage
    encrypted_blob = nonce + ciphertext
    return base64.b64encode(encrypted_blob).decode('utf-8')

def decrypt_field(encrypted_data: str) -> str:
    """
    Decrypts a base64 encoded string using AES-256-GCM.
    Expects [nonce][ciphertext] format.
    """
    if not encrypted_data:
        return encrypted_data
        
    try:
        decoded_blob = base64.b64decode(encrypted_data.encode('utf-8'))
        nonce = decoded_blob[:12]
        ciphertext = decoded_blob[12:]
        
        decrypted_data = aesgcm.decrypt(nonce, ciphertext, None)
        return decrypted_data.decode('utf-8')
    except Exception as e:
        # In case of decryption failure, return original or log error
        # In a real app, you might want to raise a specific exception
        print(f"Decryption failed: {e}")
        return "[DECRYPTION_FAILED]"

if __name__ == "__main__":
    # Quick test
    original_text = "Highly sensitive health note."
    encrypted = encrypt_field(original_text)
    decrypted = decrypt_field(encrypted)
    
    print(f"Original: {original_text}")
    print(f"Encrypted: {encrypted}")
    print(f"Decrypted: {decrypted}")
    assert original_text == decrypted

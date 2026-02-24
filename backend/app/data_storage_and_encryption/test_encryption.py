import os
import base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

# Simple test key
TEST_KEY = b"12345678901234567890123456789012" # 32 bytes
aesgcm = AESGCM(TEST_KEY)

def test_encryption():
    data = "Sensitive Health Data"
    nonce = os.urandom(12)
    ciphertext = aesgcm.encrypt(nonce, data.encode(), None)
    
    # Decrypt
    decrypted = aesgcm.decrypt(nonce, ciphertext, None)
    print(f"Original: {data}")
    print(f"Decrypted: {decrypted.decode()}")
    
    assert data == decrypted.decode()
    print("Encryption test passed!")

if __name__ == "__main__":
    test_encryption()

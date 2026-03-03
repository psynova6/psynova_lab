from passlib.context import CryptContext
import time

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

print("Passlib Hash Schemes:", pwd_context.schemes())
print("Default scheme:", pwd_context.default_scheme())

try:
    import argon2
    print("Argon2 module found:", argon2.__version__)
except ImportError:
    print("Argon2 module NOT found via import argon2")

p = "test1234"
h = pwd_context.hash(p)
print("Hash generated:", h)

start = time.time()
v = pwd_context.verify(p, h)
end = time.time()
print(f"Verification took: {end - start:.4f}s")

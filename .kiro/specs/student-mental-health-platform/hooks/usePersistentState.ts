import React, { useState, useEffect } from 'react';

function getInitialValue<T>(key: string, initialValue: T): T {
    try {
      const item = window.localStorage.getItem(key);
      // Ensure we don't return null for a non-nullable initial value.
      if (item) {
        const parsed = JSON.parse(item);
        return parsed !== null ? parsed : initialValue;
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
}


export function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [storedValue, setStoredValue] = useState<T>(() => getInitialValue(key, initialValue));

    useEffect(() => {
        try {
            // A custom replacer to strip out functions from objects before storing.
            const replacer = (key: string, value: any) => {
                if (typeof value === 'function') {
                    return undefined;
                }
                return value;
            };
            const valueToStore = JSON.stringify(storedValue, replacer);
            window.localStorage.setItem(key, valueToStore);
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}

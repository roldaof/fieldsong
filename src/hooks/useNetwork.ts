import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useNetwork() {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
  }, []);

  return { isConnected };
}

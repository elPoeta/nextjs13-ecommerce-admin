'use client';

import React, { useState, useEffect } from 'react';

interface ClientOnlyProviderProps {
  children: React.ReactNode;
}

export const ClientOnlyProvider: React.FC<ClientOnlyProviderProps> = ({
  children
}) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, [])

  if (!hasMounted) return null;

  return (
    <>
      {children}
    </>
  );
};

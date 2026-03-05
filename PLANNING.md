# PLANNING.md - BTCFixed MVP Roadmap

## 📋 Resumen Ejecutivo

**Objetivo**: Transformar BTCFixed de un frontend estático a una **DeFi platform funcional** alimentada por el SDK **StarkZap** en Starknet. El plan es construir un MVP que materialice las operaciones core (stake, bridge, lending) mientras mantenemos la interfaz polida.

**Stack Final**:
- **Frontend**: React 19 + TypeScript + Vite + Tailwind
- **Blockchain SDK**: StarkZap (Starknet abstraction)
- **Networking**: Starknet Sepolia (testnet) → Mainnet
- **Deployment**: Cloudflare Pages (frontend) + Workers (backend/paymaster proxy)
- **Mobile**: React Native + Expo (tras MVP web)

**Constraint**: Pagos anónimos → PRÓXIMAMENTE (v1.1)

---

## 🎯 Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────┐
│ Frontend (React / React Native)                             │
│  App.tsx → Auth → Dashboard → Staking/Bridge/Lending       │
└─────────────────────────────────────────────────────────────┘
                         ↓
         ┌───────────────────────────────────┐
         │  StarkZap SDK (Blockchain Layer)  │
         │  - Wallet management              │
         │  - ERC20 operations                │
         │  - Staking/Delegation              │
         │  - Swaps (AVNU)                    │
         └───────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Cloudflare Backend (Optional)                               │
│ - Paymaster proxy (gasless via AVNU)                        │
│ - Session management                                         │
│ - Rate limiting                                             │
└─────────────────────────────────────────────────────────────┘
                         ↓
   ┌───────────────────────────────────────┐
   │     Starknet Sepolia / Mainnet        │
   │  - Staking pool contracts             │
   │  - ERC20 tokens (STRK, tokens)         │
   │  - AVNU for swaps                      │
   └───────────────────────────────────────┘
```

---

## 📅 Roadmap por Sesión (MVPs Incrementales)

> **Leyenda**: ✅ Completada | 🚧 En progreso | ⏳ Pendiente

| Sesión | Feature                  | Status       |
|--------|--------------------------|--------------|
| 1      | Auth + Dashboard reales  | ✅ Completada |
| 1b     | Mainnet + Cartridge      | ✅ Completada |
| 2      | Staking STRK (StarkZap)  | ✅ Completada |
| 3      | Swaps (AVNU)             | ⏳ Pendiente  |
| 4      | Lending                  | ⏳ Pendiente  |
| 5      | Activity History         | ⏳ Pendiente  |
| 6      | KYC mock                 | ⏳ Pendiente  |
| 7      | UI Polish                | ⏳ Pendiente  |
| 8      | Cloudflare Deploy        | ⏳ Pendiente  |
| 9      | Gasless (AVNU Paymaster) | ⏳ Pendiente  |
| 10     | React Native             | ⏳ Pendiente  |

### **SESIÓN 1: Setup & Fundamentos Blockchain**

#### Objetivos
- [ ] Integración básica de StarkZap
- [ ] Autenticación con billetera
- [ ] Visualizar saldo real on-chain
- [ ] Deploy en Cloudflare Pages

#### Tareas Detalladas

**1.1 - Preparar dependencias y estructura**
- [ ] `npm install starkzap` (y sus peer deps: starknet@^9.0.0)
- [ ] Crear carpeta `src/hooks/` para custom hooks
- [ ] Crear carpeta `src/contexts/` para contextos globales
- [ ] Crear carpeta `src/services/` para lógica blockchain
- [ ] Crear carpeta `src/config/` para constantes (network, tokens)
- [ ] Actualizar `tsconfig.json` si es necesario (path aliases)

**1.2 - Configurar StarkZap SDK**
- [ ] Crear `src/config/starkzap.ts` con:
  - Network config (Sepolia para testing, Mainnet después)
  - Token presets (STRK, fBTC, fUSD si existen)
  - Chain IDs y RPC endpoints
- [ ] Crear `src/services/starkzap.ts`:
  - Instancia singleton del SDK
  - Helper functions (wallet connect, get balance, etc)

**1.3 - Crear hooks de billetera**
- [ ] `src/hooks/useStarkZap.ts`:
  - Hook para inicializar SDK
  - Onboarding con estrategia (Signer/Privy/Cartridge)
  - Estado de wallet (conectada, dirección, saldo)
  - Funciones para conectar/desconectar
- [ ] `src/hooks/useBalance.ts`:
  - Fetching de saldos de tokens específico
  - Polling automático cada 5-10 seg
  - Caching simple

**1.4 - Contexto global de autenticación**
- [ ] Crear `src/contexts/AuthContext.tsx`:
  - State: `wallet`, `isConnected`, `chainId`, `loading`
  - Métodos: `connect()`, `disconnect()`, `switchChain()`
  - Persistencia en localStorage (address solo, NO keys)
- [ ] Proveer contexto en `App.tsx`

**1.5 - Actualizar AuthScreen**
- [ ] `components/AuthScreen.tsx`:
  - Eliminar auth mock (usuario/contraseña)
  - Agregar botones de conexión: "Connect Cartridge" / "Privy Login" / "Use Private Key (dev)"
  - Mostrar spinner mientras se conecta
  - Validar que wallet esté deployada en Starknet
- [ ] Flujo: Click → onboarding del SDK → setear contexto → ir a Dashboard

**1.6 - Actualizar Dashboard**
- [ ] Mostrar balance real (usar `useBalance`)
  - Reemplazar valores hardcoded (142.5 BTC) por saldo real
  - Soportar multiplos tokens (STRK, USDC, etc)
  - Mostrar conversión USD vía oracle (puede ser simplificado: hardcode vía CoinGecko API)
- [ ] Mostrar dirección de wallet (truncada)
- [ ] Mostrar network (Sepolia / Mainnet)
- [ ] Botón "Desconectar"

**1.7 - Deploy en Cloudflare Pages**
- [ ] Crear `wrangler.toml` para config de Cloudflare
- [ ] Build script: `npm run build` → `dist/`
- [ ] Conectar repo a Cloudflare Pages
- [ ] Variables de env: `VITE_STARKNET_RPC`, `VITE_NETWORK` (dev/prod)
- [ ] Verificar que SDK funciona en Cloudflare (sin node API calls problematicas)

#### Entregables al final de SESIÓN 1
- ✅ App deployable en Cloudflare Pages
- ✅ Usuario puede conectar billetera (testnet)
- ✅ Dashboard muestra saldo real on-chain
- ✅ Flow de autenticación integrado con StarkZap

#### Dependencias
- Ninguna (es foundational)

---

### **SESIÓN 2: Staking Funcional**

#### Objetivos
- [ ] Implementar flujo completo de staking
- [ ] Usuarios pueden depositar y ver recompensas
- [ ] Actualizar UI de Staking component

#### Tareas Detalladas

**2.1 - Investigar contratos de staking en Starknet**
- [ ] Buscar en Starknet mainnet cuáles son los staking pools disponibles
  - Strk staking (oficial)
  - Otros protocolos DeFi (Nostra, zkLend, etc)
  - Decidir cuál usar (recomendación: staking de STRK oficial)
- [ ] Documentar: dirección del pool, ABI, funciones clave

**2.2 - Crear servicio de staking**
- [ ] `src/services/staking.ts`:
  - `getStakingPools()`: Listar pools disponibles (hardcoded o vía oracle)
  - `getPoolInfo(poolAddress)`: TVL, APY, total staked
  - `getCurrentStake(walletAddress, poolAddress)`: Cuánto ha staked el usuario
  - `getPoolRewards(walletAddress, poolAddress)`: Recompensas acumuladas
  - `enterPool(poolAddress, amount)`: Ejecutar transacción de stake
  - `exitPool(poolAddress)`: Unstake
  - `claimRewards(poolAddress)`: Reclamar ganancias

**2.3 - Crear hooks para staking**
- [ ] `src/hooks/useStakingPools.ts`:
  - Fetch lista de pools
  - Estados: loading, pools[], error
- [ ] `src/hooks/useStakingInfo.ts`:
  - Fetch info del usuario en pool específica
  - APY, recompensas, balance staked
  - Polling cada 10 seg
- [ ] `src/hooks/useStakeTransaction.ts`:
  - Ejecutar stake/unstake/claim
  - Manejo de transacciones (loading, error, success)
  - Esperar confirmación on-chain

**2.4 - Actualizar Staking.tsx component**
- [ ] Reemplazar mock data con `useStakingPools()` + `useStakingInfo()`
- [ ] Flujo de stake:
  1. Usuario selecciona pool
  2. Ingresa cantidad (con validación: balance >= cantidad)
  3. Aprueba token (ERC20 approve si es necesario)
  4. Ejecuta transacción de stake
  5. Espera confirmación y actualiza UI
- [ ] Mostrar estado: APY, recompensas acumuladas, balance staked
- [ ] Botones: "Stake", "Unstake", "Claim Rewards"
- [ ] Validaciones: balance insuficiente, cantidad negativa, etc
- [ ] Mostrar spinner y feedback mientras se ejecuta transacción

**2.5 - Actualizar Activity History**
- [ ] Registrar transacciones de staking reales en Activity component
  - Tipo: 'Stake', 'Unstake', 'Claim'
  - Status: Pending → Completed (basado en tx receipt)
  - Amount, timestamp real
  - Txn hash con link a explorer

**2.6 - Testing en testnet**
- [ ] Crear cuenta de prueba en Sepolia
- [ ] Testear flujo completo: connect → stake → wait → claim
- [ ] Verificar en https://testnet.starkscan.co/ que las txs aparecen

#### Entregables al final de SESIÓN 2
- ✅ Staking component completamente funcional
- ✅ Usuarios pueden ver APYs y hacer stake de tokens
- ✅ Activity history muestra transacciones reales de staking
- ✅ Soporta múltiples pools

#### Dependencias
- SESIÓN 1 completada (autenticación y billetera)

---

### **SESIÓN 3: Bridge (Swaps) Funcional**

#### Objetivos
- [ ] Implementar bridge/swap de tokens
- [ ] Integración con AVNU para mejores rates
- [ ] UI actualizada con precios reales

#### Tareas Detalladas

**3.1 - Integrar AVNU Swap Protocol**
- [ ] StarkZap ya tiene soporte de AVNU integrado
- [ ] Crear `src/services/swap.ts`:
  - `getSwapQuote(tokenIn, tokenOut, amountIn)`: Obtener mejor rate
  - `executeSwap(quoteParams)`: Ejecutar swap
  - Manejar slippage (user sets tolerance, default 0.5%)
- [ ] Configurar AVNU API key en env variables

**3.2 - Crear hooks para swaps**
- [ ] `src/hooks/useSwapQuote.ts`:
  - Obtener quote automáticamente cuando usuario cambia inputs
  - Debounce de 500ms para no hacer requests por cada keystroke
  - Estado: quote, loading, error, minAmountOut
- [ ] `src/hooks/useSwapTransaction.ts`:
  - Ejecutar transacción de swap
  - Manejo de allowance (approve token si es necesario)

**3.3 - Actualizar Bridge.tsx (Swap Terminal)**
- [ ] Reemplazar mock con lógica real:
  - Input de cantidad → `useSwapQuote()` → muestra output mínimo
  - Lista de tokens disponibles (dropdown)
  - Toggle de par de tokens
- [ ] Flujo de transacción:
  1. Usuario ingresa cantidad y selecciona tokens
  2. App muestra quote en tiempo real
  3. Usuario confirma
  4. App ejecuta approve (si necesario) + swap
  5. Espera confirmación y muestra resultado
- [ ] Mostrar rates, slippage esperado, precio por token
- [ ] Soporte para tokens comunes: STRK, USDC, USDT, ETH, fBTC

**3.4 - Integración con Activity History**
- [ ] Registrar swaps en Activity component
  - Tipo: 'Bridge' (será el tipo para swaps)
  - Mostrar par: "0.5 BTC → 1250 USDC"

**3.5 - Testing**
- [ ] Testear en testnet con tokens de prueba
- [ ] Verificar slippage, fees, rates
- [ ] Performance: que la app no lag cuando fetching quotes

#### Entregables al final de SESIÓN 3
- ✅ Swap/Bridge completamente operacional
- ✅ Usuarios pueden intercambiar tokens con mejores rates de AVNU
- ✅ Quote en tiempo real y transacciones funcionales

#### Dependencias
- SESIÓN 1 completada

---

### **SESIÓN 4: Lending (Préstamos) - Básico**

#### Objetivos
- [ ] Implementar protocolo de lending básico
- [ ] Usuarios pueden depositar colateral y pedir préstamos
- [ ] Mostrar ratios de colateral

#### Tareas Detalladas

**4.1 - Investigar protocolos de lending en Starknet**
- [ ] Opciones: Nostradamus (Nostra), zkLend, Nimbora, etc
- [ ] Elegir uno (recomendación: Nostra o zkLend por liquidez)
- [ ] Documentar: direcciones de contratos, tokens soportados, rates

**4.2 - Crear servicio de lending**
- [ ] `src/services/lending.ts`:
  - `getLendingMarkets()`: Listar mercados
  - `getMarketData(token)`: Tasas de depósito/préstamo, utilización
  - `getUserLendingPosition(wallet)`: Colateral depositado, deuda, LTV
  - `depositCollateral(token, amount)`: Depositar
  - `borrowTokens(token, amount)`: Solicitar prestaratio
  - `repayLoan(token, amount)`: Devolver préstamo

**4.3 - Crear hooks para lending**
- [ ] `src/hooks/useLendingMarkets.ts`
- [ ] `src/hooks/useLendingPosition.ts`
- [ ] `src/hooks/useLendingTransaction.ts`

**4.4 - Actualizar Lending.tsx**
- [ ] Dos secciones: "Deposit Collateral" + "Borrow"
- [ ] Mostrar:
  - Mercados disponibles con APY
  - Posición actual del usuario (colateral, deuda)
  - LTV ratio (loan-to-value)
  - Máximo que puede pedir prestado
- [ ] Flujos:
  - Deposit: selecciona token → ingresa cantidad → ejecuta transacción
  - Borrow: selecciona token → ingresa cantidad → validar LTV → ejecutar

**4.5 - Activity History**
- [ ] Registrar: Deposit, Borrow, Repay

#### Entregables al final de SESIÓN 4
- ✅ Lending component funcional
- ✅ Usuarios pueden depositar y pedir prestados
- ✅ Muestra LTV y ratios en tiempo real

#### Dependencias
- SESIÓN 1 completada

---

### **SESIÓN 5: Activity History & Dashboard Analytics**

#### Objetivos
- [ ] Actualizar Activity History con datos reales
- [ ] Dashboard muestra metrices relevantes
- [ ] Gráficos de performance histórica

#### Tareas Detalladas

**5.1 - Refactorizar Activity component**
- [ ] Cambiar de mock data a datos reales
- [ ] Conectar con historial de transacciones del wallet
  - API de Starknet (Starkscan API o starknet.js)
  - Filtrar por tipo (stake, swap, lending)
- [ ] Mostrar:
  - Hash de transacción con link a explorer
  - Timestamp real
  - Status (Pending, Completed, Failed) basado en receipt
  - Iconos y colores apropiados

**5.2 - Dashboard Analytics**
- [ ] Agregar métricas:
  - Total valor (TVL del usuario)
  - Recompensas ganadas (sum de staking rewards)
  - Ganancias por swap (fees o slippage evitados)
  - Tasa de APY promedio
- [ ] Gráfico: Valor del portafolio en el tiempo (7d, 30d, all-time)
- [ ] Usar recharts (ya instalado)

**5.3 - Persistencia y Caching**
- [ ] LocalStorage para cachear transacciones
- [ ] Invalidar cache cuando hay nueva transacción

#### Entregables al final de SESIÓN 5
- ✅ Activity History muestra historial real
- ✅ Dashboard con analytics y gráficos
- ✅ Performance visualization

#### Dependencias
- SESIÓN 2, 3, 4 completadas

---

### **SESIÓN 6: Verificación KYC/AML - Básico**

#### Objetivos
- [ ] Implementar flow de verificación (mock)
- [ ] Gating de features según verificación
- [ ] Future-proof para integración con provider real

#### Tareas Detalladas

**6.1 - Crear contexto de verificación**
- [ ] `src/contexts/VerificationContext.tsx`
- [ ] State: `verificationStatus`, `verificationLevel` (unverified | basic | full)
- [ ] Métodos: `initiate()`, `verify()`, `getStatus()`

**6.2 - Actualizar Verification.tsx**
- [ ] Flow de verificación (mock por ahora):
  1. Seleccionar nivel (Basic / Full)
  2. Ingresar datos requeridos
  3. Mostrar "Verificando..." por 3 seg
  4. Marcar como verificado
- [ ] Almacenar solo en localStorage + contexto global
- [ ] Future: Integration hook para providers reales (Stripe Identity, Sumsub, etc)

**6.3 - Feature gating**
- [ ] Lending y amounts grandes → requieren básica
- [ ] Algunos tokens → requieren full verificación
- [ ] Mostrar mensajes: "Verifica tu identidad para acceder a esta función"

#### Entregables al final de SESIÓN 6
- ✅ Verification component funcional
- ✅ Feature gating básico
- ✅ Preparado para integración futura con providers reales

#### Dependencias
- SESIÓN 1 completada

---

### **SESIÓN 7: UI/UX Polish & Optimizaciones**

#### Objetivos
- [ ] Mejorar experiencia de usuario
- [ ] Optimizar performance
- [ ] Pulir detalles visuales y animaciones

#### Tareas Detalladas

**7.1 - Loading states & skeleton screens**
- [ ] Crear componentes de skeleton loaders
- [ ] Mostrar mientras se fetchia data blockchain

**7.2 - Error handling mejorado**
- [ ] Toast notifications para errores
- [ ] Retry buttons cuando algo falla
- [ ] User-friendly error messages

**7.3 - Optimizaciones de performance**
- [ ] Code splitting con lazy imports
- [ ] Memo componentes que no cambian frecuentemente
- [ ] Debouncing de inputs
- [ ] Optimizar polling de balances (no tan frecuente)

**7.4 - Dark mode improvements**
- [ ] Revisar contraste y accesibilidad
- [ ] Asegurar que todos los componentes se ven bien en ambos modes

**7.5 - Mobile responsiveness**
- [ ] Testear en device real o simulador
- [ ] Ajustar tamaños de botones, inputs para touch
- [ ] Verificar que no hay horizontal scroll

**7.6 - Accessibility**
- [ ] Labels y ARIA attributes
- [ ] Navegación con teclado
- [ ] Colores accesibles para daltónicos

#### Entregables al final de SESIÓN 7
- ✅ UI pulida y consistente
- ✅ Buen performance
- ✅ Mobile-friendly
- ✅ Accesible

#### Dependencias
- SESIÓN 2-6 completadas

---

### **SESIÓN 8: Despliegue en Cloudflare & Testing en Mainnet**

#### Objetivos
- [ ] App producción-ready en Cloudflare
- [ ] Testear en Starknet mainnet
- [ ] Setup de envs (dev/test/prod)

#### Tareas Detalladas

**8.1 - Configurar environments**
- [ ] `.env.local` (dev, Sepolia)
- [ ] `.env.production` (prod, Mainnet)
- [ ] Variables necesarias:
  - `VITE_STARKNET_NETWORK` (sepolia | mainnet)
  - `VITE_STARKNET_RPC_URL`
  - `VITE_AVNU_API_KEY`
  - Network-específico: colaterales, pools, oracles

**8.2 - Build & deployment**
- [ ] `npm run build` sin warnings
- [ ] Tamaño del bundle (target < 300KB minificado)
  - Si necesario: lazy-load StarkZap, tree-shake
- [ ] Deploy a Cloudflare Pages:
  - Conectar GitHub repo
  - Build command: `npm run build`
  - Output: `dist/`

**8.3 - Testing en Sepolia**
- [ ] Crear accountas de prueba
- [ ] Testear cada flujo end-to-end
- [ ] Verificar transacciones en Starkscan

**8.4 - Setup para Mainnet (opcional en v1)**
- [ ] Si se decide hacer mainnet: cambiar RPC, actualizar oracles de precios
- [ ] Usar amounts pequeños para testing
- [ ] Documentar diferencias Sepolia vs Mainnet

#### Entregables al final de SESIÓN 8
- ✅ App deployada en Cloudflare
- ✅ Completamente testada en testnet
- ✅ Ready para mainnet (si aplica)

#### Dependencias
- SESIÓN 7 completada

---

### **SESIÓN 9: Gasless Transactions (Opcional para v1.0, Recomendado)**

#### Objetivos
- [ ] Usuarios pueden hacer transacciones sin pagar gas
- [ ] Integración con AVNU Paymaster
- [ ] Mejor UX (sin gas fees)

#### Tareas Detalladas

**9.1 - Setup AVNU Paymaster**
- [ ] Registrar en AVNU (https://avnu.fi/)
- [ ] Obtener API keys y endpoint
- [ ] Documentar rates y limits

**9.2 - Integrar paymaster en StarkZap**
- [ ] En `src/services/starkzap.ts`:
  - Configurar AVNU paymaster
  - Opción para usar `feeMode: "sponsored"` en transacciones
- [ ] Crear hook `useGaslessTransaction()`

**9.3 - Feature toggle**
- [ ] A nivel de transacción: usuario elige si pagar gas o usar gasless
- [ ] Background: si gasless queda sin saldo en paymaster, fallback a user_pays

**9.4 - Testing**
- [ ] Testear transacciones gasless en testnet
- [ ] Verificar que funciona con staking, swaps, lending

#### Entregables al final de SESIÓN 9
- ✅ Transacciones gasless opcionales
- ✅ Mejor UX sin fees
- ✅ Fallback a user_pays si es necesario

#### Dependencias
- SESIÓN 2-4 completadas

---

### **SESIÓN 10: React Native & Expo Setup (Futura)**

#### Objetivos
- [ ] Versión mobile nativa (iOS/Android)
- [ ] Reutilizar lógica blockchain (hooks, servicios)
- [ ] Deployable en App Stores

#### Tareas Detalladas

**10.1 - Scaffold proyecto Expo**
- [ ] `npx create-expo-app@latest btcfixed-mobile`
- [ ] Instalar `@starkzap/native` y polyfills
- [ ] Setup de desarrollo: Expo Go, EAS Build

**10.2 - Refactorizar código compartido**
- [ ] Mover `src/services/` y `src/hooks/` a monorepo o shared package
- [ ] UI: refactorizar componentes React para RNW compatibility (Tamagui, NativeWind)

**10.3 - Build mobile UI**
- [ ] Adaptación de componentes para React Native
- [ ] Touch-friendly UX
- [ ] Biometric auth (Face ID, Touch ID)

**10.4 - Testing**
- [ ] Simulador iOS/Android
- [ ] Device testing
- [ ] Push notifications (opcional)

#### Entregables al final de SESIÓN 10
- ✅ App iOS y Android funcionales
- ✅ Feature parity con web
- ✅ Pronto para App Stores

#### Dependencias
- SESIÓN 8 completada

---

## 🚀 Checklist de Entrega Final (MVP v1.0)

### Core Features
- [x] Autenticación con Starknet wallet
- [x] Ver saldo en tiempo real
- [x] Staking funcional
- [x] Bridge/Swaps (AVNU)
- [x] Lending básico
- [x] Activity history
- [x] Verificación KYC (mock)
- [x] Dashboard con analytics

### Técnico
- [x] StarkZap SDK completamente integrado
- [x] TypeScript strict mode
- [x] Error handling robusto
- [x] Performance optimizado
- [x] Mobile responsive

### Deployment
- [x] Cloudflare Pages setup
- [x] Env variables configuradas
- [x] Build optimizado
- [x] Testing en testnet completo

### Documentación
- [ ] README.md actualizado con instrucciones de setup y uso
- [ ] API docs de custom hooks
- [ ] Diagrama de arquitectura
- [ ] Guía de deployment

---

## 📦 Estructura Final del Proyecto

```
btcfixed/
├── src/
│   ├── components/              # Componentes React (existentes + actualizados)
│   ├── hooks/                   # Custom hooks para blockchain
│   │   ├── useStarkZap.ts
│   │   ├── useBalance.ts
│   │   ├── useStakingPools.ts
│   │   ├── useStakingInfo.ts
│   │   ├── useStakeTransaction.ts
│   │   ├── useSwapQuote.ts
│   │   ├── useSwapTransaction.ts
│   │   ├── useLendingMarkets.ts
│   │   ├── useLendingPosition.ts
│   │   └── useLendingTransaction.ts
│   ├── contexts/                # Contextos globales
│   │   ├── AuthContext.tsx
│   │   └── VerificationContext.tsx
│   ├── services/                # Lógica de negocio (blockchain)
│   │   ├── starkzap.ts
│   │   ├── staking.ts
│   │   ├── swap.ts
│   │   ├── lending.ts
│   │   └── activity.ts
│   ├── config/                  # Configuración
│   │   ├── starkzap.ts
│   │   ├── tokens.ts
│   │   └── networks.ts
│   ├── types.ts                 # Type definitions (existente)
│   ├── App.tsx                  # (actualizado)
│   └── index.tsx
├── public/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js (si no existe)
├── PLANNING.md                  # Este archivo
├── README.md                    # (a actualizar)
└── wrangler.toml                # Cloudflare config
```

---

## 🔐 Security Considerations

1. **No almacenar claves privadas en el navegador**
   - Usar Cartridge Controller o Privy (custodial)
   - Alternativa dev: provider de clave privada conectado server-side

2. **Validación de transacciones**
   - Siempre validar amounts vía smart contracts (no confiar en frontend)
   - Usar preflight simulation de transacciones

3. **Rate limiting**
   - Si agregamos backend (Cloudflare Workers): rate-limit por IP/wallet

4. **Variables sensibles**
   - Nunca commitear `.env.local` o credenciales
   - Usar `*.env.example` como template

---

## 🎓 Recursos Clave

### Documentación
- **StarkZap**: https://github.com/keep-starknet-strange/starkzap/tree/main/docs
- **Starknet.js**: https://www.starknetjs.com/
- **Starknet Docs**: https://docs.starknet.io/
- **Sepolia Testnet**: https://sepolia.starkscan.co/

### Exploradores
- **Starkscan (Mainnet)**: https://starkscan.co/
- **Starkscan (Sepolia)**: https://sepolia.starkscan.co/
- **Stark Compass**: https://starkcompass.com/

### Herramientas
- **Wallet: Argent X**: https://www.argent.xyz/
- **Wallet: Braavos**: https://braavos.app/
- **Wallet: Cartridge**: https://cartridge.gg/
- **Testnet Faucets**: https://starknet-faucet.vercel.app/

---

## 📌 Notas Importantes

### MVP v1.0 NO INCLUYE
- ❌ Pagos anónimos (v1.1)
- ❌ Derivación de claves en el cliente
- ❌ Soporte mainnet (solo testnet; mainnet en v1.1)
- ❌ Mobile nativo (solo web responsive; mobile en v2)
- ❌ Integraciones de terceros complejas (Stripe, etc)

### MVP v1.0 INCLUYE (Scope Definitivo)
- ✅ Web + Responsive
- ✅ Staking STRK
- ✅ Swaps AVNU
- ✅ Lending básico
- ✅ Activity tracking
- ✅ KYC mock
- ✅ Testnet Sepolia
- ✅ Cloudflare Pages

---

## 🔄 Evolución Futura

### v1.1 (Post-MVP)
- Mainnet deployment
- Pagos anónimos vía StarkEx/Volition
- Más protocolos de staking/lending
- Backend paymaster robusto

### v2.0
- React Native + iOS/Android
- Push notifications
- Advanced analytics
- Token swaps multi-hop
- Liquidation protection

---

**Creado**: Marzo 5, 2026  
**Última actualización**: Marzo 5, 2026  
**Status**: READY FOR DEVELOPMENT

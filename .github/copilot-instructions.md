# BTCFixed — Instrucciones para GitHub Copilot Agent

## Proyecto
**BTCFixed** es una DeFi platform para Bitcoin HOLDERS en Starknet.  
Stack: React 19 + TypeScript + Vite + Tailwind CDN + StarkZap SDK.  
Deploy target: Cloudflare Pages.  
Network: Starknet Sepolia (testnet). Mainnet queda para v1.1.

## Modo de Trabajo: AUTÓNOMO TOTAL
- **Trabajar como autómata**: Completar todas las tareas de la sesión sin pedir confirmación en cada paso.
- **No preguntar** antes de editar archivos, ejecutar comandos de terminal, instalar dependencias o crear archivos.
- **Decidir solo** sobre detalles de implementación; solo consultar al usuario si hay una ambigüedad de negocio crítica (ej: cambiar el scope del MVP).
- **Continuar ante errores de compilación**: diagnosticarlos y corregirlos sin esperar input del usuario.
- **Hacer commits frecuentes** al finalizar cada sub-tarea lógica.

## Restricciones de Seguridad (no saltear jamás)
- Nunca hacer `git push --force` sin confirmar con el usuario.
- Nunca borrar archivos sin confirmar si podrían ser trabajo en curso del usuario.
- Nunca commitear claves privadas, `.env.local` real, ni secrets.
- Nunca usar `rm -rf` en paths fuera de `node_modules/`.

## Arquitectura

```
btcfixed/
├── App.tsx                  # Root — AuthProvider + AppShell
├── index.tsx                # Entry point
├── types.ts                 # TabType, Activity, TokenData
├── components/
│   ├── AuthScreen.tsx       # Wallet connect (Argent X / Braavos)
│   ├── Dashboard.tsx        # Saldo real via useBalance + usePrices
│   ├── Header.tsx           # Dirección truncada + copy + disconnect
│   ├── BottomNav.tsx        # Navegación mobile
│   ├── Bridge.tsx           # Swaps — AVNU (Sesión 3)
│   ├── Staking.tsx          # STRK staking pool (Sesión 2)
│   ├── Lending.tsx          # Lending/colateral (Sesión 4)
│   ├── Verification.tsx     # KYC mock (Sesión 6)
│   └── ActivityHistory.tsx  # Historial de txs (Sesión 5)
├── contexts/
│   └── AuthContext.tsx      # Estado global wallet (address, connect, disconnect)
├── hooks/
│   ├── useBalance.ts        # ERC-20 balance polling via starknet.js RpcProvider
│   └── usePrices.ts         # Precios CoinGecko (ETH, STRK, USDC)
├── services/
│   └── sdk.ts               # StarkZap singleton (lazy init)
└── config/
    ├── networks.ts          # Sepolia / Mainnet RPC + explorer URLs
    ├── tokens.ts            # ETH, STRK, USDC — addresses + decimals
    └── wallets.ts           # Argent X, Braavos — detect + connect helpers
```

## Variables de entorno
```
VITE_STARKNET_NETWORK=sepolia        # o mainnet
VITE_STARKNET_RPC_URL=               # opcional, usa free-rpc.nethermind.io por defecto
```

## Roadmap de Sesiones
| Sesión | Feature           | Status       |
|--------|-------------------|--------------|
| 1      | Auth + Dashboard  | ✅ Completada |
| 2      | Staking           | 🚧 En progreso |
| 3      | Swaps (AVNU)      | ⏳ Pendiente  |
| 4      | Lending           | ⏳ Pendiente  |
| 5      | Activity History  | ⏳ Pendiente  |
| 6      | KYC mock          | ⏳ Pendiente  |
| 7      | UI Polish         | ⏳ Pendiente  |
| 8      | Cloudflare Deploy | ⏳ Pendiente  |

## Reglas de código
- TypeScript estricto (`strict: true`), sin `any` a menos que sea inevitable y documentado.
- Componentes funcionales con React.FC<Props>.
- Hooks con `use` prefix, services con funciones puras exportadas.
- CSS: Tailwind CDN (ya incluido en index.html). No agregar archivos CSS separados. El tema dark usa la clase `dark` en `<html>`.
- Importaciones relativas siempre (no `@/` aliases en producción aún).
- Ninguna clave privada, secret o API key hardcodeada.

## Convenciones de commit
```
feat(sesión-N): descripción breve
fix: descripción del bug
chore: cambio de config/deps
```

## Build & Dev
```bash
npm run dev      # localhost:3000
npm run build    # → dist/ (Cloudflare Pages output)
npm run lint     # TypeScript check
```

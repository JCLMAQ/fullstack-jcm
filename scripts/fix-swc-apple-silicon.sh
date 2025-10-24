echo "🧹 Nettoyage complet..."
pnpm run db:docker:down
rm -rf node_modules pnpm-lock.yaml .nx/cache dist
pnpm store prune
nx reset

echo "📦 Réinstallation avec ARM64..."
arch -arm64 pnpm install --no-frozen-lockfile

echo "🔨 Rebuild des bindings natifs..."
pnpm rebuild

echo "✅ Vérification..."
node -p "'Architecture Node: ' + process.arch"
nx --version

echo "🎯 Régénération Prisma..."
pnpm run prisma:generate

echo "🐳 Redémarrage Docker..."
pnpm run db:docker:up

echo "✨ Terminé! Vous pouvez maintenant lancer:"
echo "  pnpm run start:backend:dev"
echo "  pnpm run start:frontend:dev"

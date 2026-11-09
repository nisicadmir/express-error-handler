# Publishing @nisix/express-error-handler

Run these commands from the repository root on `main`. Commit the changes you want to release before bumping the version.

## 1. Test and build

```bash
npm ci && npm test && npm run build
```

## 2. Prepare the version

Compare the local version with the versions already published on npm.

```bash
node -p "require('./package.json').version"
npm view @nisix/express-error-handler versions --json
```

If you already prepared a release version that is absent from the list, continue to step 3. If npm already lists the local version, bump it for a bug-fix release.

```bash
npm version patch
```

This updates the package manifest and lockfile and creates a Git commit and a `v`-prefixed tag.

## 3. Preview and publish

```bash
npm pack --dry-run
npm whoami
```

Check that the preview includes `dist/index.js` and `dist/index.d.ts`. If needed, run `npm login` with an account that has publish access to the package.

```bash
npm publish --access public
```

The `prepublishOnly` script rebuilds the package. Complete the two-factor authentication prompt when npm asks. [npm publishing guide](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/)

## 4. Verify and push

Confirm the registry reports the version you just released.

```bash
npm view @nisix/express-error-handler@latest version
```

Then push the release commit and tag to GitHub.

```bash
version=$(node -p "require('./package.json').version")
git push origin main "v$version"
```

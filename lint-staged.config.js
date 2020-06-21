module.exports = {
  "package.json": ["npm run format-package-json", "git add"],
  "**/*.md": ["markdownlint"],
  "**/*.{md,yaml,yml}": [
    "prettier --write",
    "git add",
  ],
  "**/*.ts": [
    "import-sort --write",
    "prettier --write",
    "eslint --cache --ext .ts --fix ./",
    "git add",
    "jest --bail --findRelatedTests",
  ],
  "src/**/*": [
    "bash -c 'npm run build'",
  ],
}

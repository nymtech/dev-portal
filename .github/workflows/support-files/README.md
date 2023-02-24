# GitHub Actions Support Files

This is a collection of scripts and files to support GitHub Actions.

## Sending Notifications

These scripts send CI notifications to Matrix by creating messages from templates and env vars passed from GitHub Actions.

### Adding notifications to a GitHub Action

```
jobs:
  build:
    ...
    - name: Notifications - Node Install
      run: npm install
      working-directory: .github/workflows/support-files/notifications
    - name: Notifications - Send
      env:
        NYM_NOTIFICATION_KIND: "my-component"
        GIT_BRANCH: "${GITHUB_REF##*/}"
        MATRIX_SERVER: "${{ secrets.MATRIX_SERVER }}"
        MATRIX_ROOM: "${{ secrets.MATRIX_ROOM }}"
        MATRIX_USER_ID: "${{ secrets.MATRIX_USER_ID }}"
        MATRIX_TOKEN: "${{ secrets.MATRIX_TOKEN }}"
        MATRIX_DEVICE_ID: "${{ secrets.MATRIX_DEVICE_ID }}"
        IS_SUCCESS: "${{ job.status == 'success' }}"
      uses: docker://node:16-bullseye
      with:
        args: .github/workflows/support-files/notifications/entry_point.sh
```

Notifications are run by adding the snippet above to a GitHub Action, and:

1. Installing node packages needed at run time
2. Set the env vars as required:
    - `NYM_NOTIFICATION_KIND` matches the directory in `.github/workflows/support-files/${NYM_NOTIFICATION_KIND}` to provide the templates and extra scripting in `index.js`
    - Matrix credentials, room and other env vars for the status of the build and repo
3. Replacing the default entry point shell script on the `node:16-bullseye` docker image to run `.github/workflows/support-files/notifications/entry_point.sh`

### Running locally

You will need:
- Node 16 LTS
- npm

Copy `.github/workflows/support-files/.env.example` to `.github/workflows/support-files/.env` and valid Matrix credentials.

Then run `npm install` to get dependencies.

Start development mode for the notification type you want either by passing the value as an env var called `NYM_NOTIFICATION_KIND` or set the `.env` file values correctly.

```bash
cd .github/workflows/support-files
npm install
cp .env.example .env
vi .env
npm run dev
```


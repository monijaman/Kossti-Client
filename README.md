This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

# Server Setup
## 1. Install nvm using curl:
First, download and install nvm:

bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash


## 2. Load nvm into your shell:
After installing nvm, you'll need to load it into your current shell session. You can do this by running the following command or by adding it to your .bashrc, .zshrc, or .profile file:

bash
 
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

##3.  install node:

nvm install 20


remove rm -rf .next node_modules





# PM2
1. Install PM2 Globally
To install PM2 globally using npm:

bash
Copy code
npm install -g pm2

2. Verify PM2 Installation
After installing PM2, verify that it’s installed correctly:

bash
Copy code
pm2 --version
You should see the version number of PM2.

3. Use PM2 to Manage Processes
Once PM2 is installed, you can use it to start and manage your Node.js applications. For example, to start a Next.js application:

bash
Copy code
pm2 start npm --name "next-app" -- start
This command will run the npm start command under PM2, giving it the name next-app.

4. View Logs with PM2
To view logs of your PM2-managed applications:

bash
Copy code
pm2 logs

5. Manage PM2 Processes
Here are some useful PM2 commands:

List all processes:

bash
Copy code
pm2 list
Stop a process:

bash
Copy code
pm2 stop next-app
Restart a process:

bash
Copy code
pm2 restart next-app
Delete a process:

bash
Copy code
pm2 delete next-app
6. Save and Auto-start PM2 Configuration
To ensure your PM2 processes start on system reboot, save the current PM2 process list and configure auto-start:

bash
Copy code
pm2 save
pm2 startup
This will generate a command to enable the PM2 startup script. Run the command provided to complete the setup.

7. Reinstall Node Modules
If you continue to encounter issues, make sure your node_modules are up-to-date:
 changed
bash
Copy code
rm -rf node_modules
npm install

meed to run

php artisan db:seed --class=CategorySeeder


generate slug:

php artisan make:command GenerateBrandSlugs
php artisan generate:brand-slugs


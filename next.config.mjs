/** @type {import('next').NextConfig} */
const nextConfig = {
    productionBrowserSourceMaps: false,

    webpack: (config, { webpack }) => {
        config.plugins.push(
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
            })
        );
        return config;
    },

    async rewrites() {
        return [
            {
                source: '/dashboard',
                destination: '/src/Pages/DashboardPages/Dashboard/Dashboard',
            },
        ];
    },
};

export default nextConfig; // ✅ ES Modules syntax

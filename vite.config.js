import path from 'path'

export default {
    build: {
        target: 'esnext',
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, "index.html"),
                subview: path.resolve(__dirname, 'src/subpages/subpageone.html'),
                whatsnew: path.resolve(__dirname, 'src/whatsnew/whatsnew.html'),
            }
        }
    }
}
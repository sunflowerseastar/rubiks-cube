require('esbuild')
  .build({
    entryPoints: ['src/main.js'],
    outfile: 'src/out.js',
    bundle: true,
    watch: {
      onRebuild(error, result) {
        if (error) console.error('watch build failed:', error);
        else {
          console.log('watch build succeeded:', result);
        }
      },
    },
  })
  .then((result) => {
    console.log('watching...');
  });

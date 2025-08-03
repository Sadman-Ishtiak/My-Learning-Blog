#!/usr/bin/env node

const { promises: fs } = require('fs');

// simple path join to avoid importing 'path' if you really want zero imports beyond fs
function join(...parts) {
  return parts
    .map((p, i) => {
      if (i === 0) return p.replace(/\/+$/g, ''); // trim trailing slash on first
      return p.replace(/^\/+|\/+$/g, ''); // trim both ends
    })
    .filter(Boolean)
    .join('/');
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    dir: '.',
    ext: null, // comma-separated, e.g. ".js,.json"
    maxDepth: Infinity,
    output: null, // file path to write JSON
    tree: false, // pretty tree to stdout
  };

  for (const arg of args) {
    if (arg.startsWith('--ext=')) {
      opts.ext = arg.slice(6).split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
    } else if (arg.startsWith('--max-depth=')) {
      const v = parseInt(arg.slice(12), 10);
      if (!isNaN(v)) opts.maxDepth = v;
    } else if (arg.startsWith('--output=')) {
      opts.output = arg.slice(9);
    } else if (arg === '--tree') {
      opts.tree = true;
    } else if (!arg.startsWith('--')) {
      opts.dir = arg;
    }
  }

  return opts;
}

async function walkDir(dir, { ext, depth, maxDepth }, relative = '') {
  if (depth > maxDepth) return [];

  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (e) {
    console.warn(`Cannot read directory "${dir}": ${e.message}`);
    return [];
  }

  const results = [];

  for (const entry of entries) {
    const name = entry.name;
    const relPath = relative ? `${relative}/${name}` : name;
    const fullPath = join(dir, name);

    if (entry.isDirectory()) {
      const children = await walkDir(fullPath, { ext, depth: depth + 1, maxDepth }, relPath);
      results.push({
        name,
        path: relPath,
        type: 'directory',
        children,
      });
    } else if (entry.isFile()) {
      if (ext && !ext.some(e => name.toLowerCase().endsWith(e))) {
        continue;
      }
      let stat;
      try {
        stat = await fs.stat(fullPath);
      } catch {
        stat = null;
      }
      results.push({
        name,
        path: relPath,
        type: 'file',
        size: stat ? stat.size : null,
        mtime: stat ? stat.mtime.toISOString() : null,
      });
    }
  }

  return results;
}

function printTree(nodes, prefix = '') {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const isLast = i === nodes.length - 1;
    const pointer = isLast ? '└── ' : '├── ';
    if (node.type === 'directory') {
      console.log(prefix + pointer + node.name + '/');
      printTree(node.children || [], prefix + (isLast ? '    ' : '│   '));
    } else {
      console.log(prefix + pointer + node.name);
    }
  }
}

(async () => {
  const opts = parseArgs();
  const structure = await walkDir(opts.dir, {
    ext: opts.ext,
    depth: 0,
    maxDepth: opts.maxDepth,
  });

  if (opts.tree) {
    printTree(structure);
  } else {
    const out = {
      root: opts.dir,
      generated: new Date().toISOString(),
      structure,
    };
    const json = JSON.stringify(out, null, 2);
    if (opts.output) {
      try {
        await fs.mkdir(opts.output.replace(/\/[^/]*$/, ''), { recursive: true });
        await fs.writeFile(opts.output, json + '\n', 'utf8');
        console.log(`Wrote JSON to ${opts.output}`);
      } catch (e) {
        console.error('Failed to write output file:', e.message);
        process.stdout.write(json + '\n');
      }
    } else {
      console.log(json);
    }
  }
})();

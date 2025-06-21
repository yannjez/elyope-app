import {
    Tree,
    readProjectConfiguration,
    formatFiles,
    logger,
  } from '@nx/devkit';
  import { createProjectGraphAsync } from 'nx/src/project-graph/project-graph';
  
  export default async function (tree: Tree, schema: { project: string }) {
    const graph = await createProjectGraphAsync();
    const project = readProjectConfiguration(tree, schema.project);
  
    const deps = graph.dependencies[schema.project]
      .map((dep) => dep.target)
      .filter((name) => name.startsWith('design-system') || name.startsWith('ui'));
  
    const sourceLines = deps.map(
      (dep) => `@source "../../../libs/${dep}/src/styles.css";`
    );
  
    const cssPath = `${project.root}/src/styles.css`;
    if (!tree.exists(cssPath)) {
      logger.warn(`File ${cssPath} does not exist.`);
      return;
    }
  
    const base = '@import "tailwindcss";';
    tree.write(cssPath, [base, ...sourceLines].join('\n'));
  
    await formatFiles(tree);
  }
  
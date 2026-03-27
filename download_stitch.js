const fs = require('fs');

const files = [
  { name: 'dashboard.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzE2NTQwYTdlZWNmNjRjZTU4YTZlZjNiMzJiYjAwYmZmEgsSBxDMrunMpQoYAZIBJAoKcHJvamVjdF9pZBIWQhQxMTM0MzI2MjEyMzA5NjMwNzU5MQ&filename=&opi=96797242' },
  { name: 'task_manager.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzQ2ZTJlYjY5ZGRhOTQ4MDZiZTA0Y2QwOTU2Y2QzM2VhEgsSBxDMrunMpQoYAZIBJAoKcHJvamVjdF9pZBIWQhQxMTM0MzI2MjEyMzA5NjMwNzU5MQ&filename=&opi=96797242' },
  { name: 'journal.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2U5Mjk2MjVmOTdjZjQyMTM4M2FmMzllNTM1MTBhNzMxEgsSBxDMrunMpQoYAZIBJAoKcHJvamVjdF9pZBIWQhQxMTM0MzI2MjEyMzA5NjMwNzU5MQ&filename=&opi=96797242' },
  { name: 'community.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzEwMjZhOTQyZDRjZDQ4Zjc4MzQzZmE0OTYwN2M3ODgyEgsSBxDMrunMpQoYAZIBJAoKcHJvamVjdF9pZBIWQhQxMTM0MzI2MjEyMzA5NjMwNzU5MQ&filename=&opi=96797242' }
];

async function download() {
  for (let file of files) {
    console.log(`Fetching ${file.name}...`);
    try {
      const res = await fetch(file.url);
      const text = await res.text();
      fs.writeFileSync(file.name, text);
      console.log(`Saved ${file.name} - length: ${text.length}`);
    } catch (e) {
      console.error(`Error with ${file.name}:`, e);
    }
  }
}

download().catch(console.error);

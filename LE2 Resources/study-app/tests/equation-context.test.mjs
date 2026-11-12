import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../dist/content.mjs';
let contexts={};
try{({equationContext:contexts}=await import('../dist/equation-context.mjs'))}catch{}
test('every displayed equation has a reading, purpose, symbol definitions and worked interpretation',()=>{
 for(const lesson of lessons)for(const [title] of lesson.formulas){
  const c=contexts[title]; assert.ok(c,`Missing equation explanation: ${title}`);
  assert.ok(c.read&&c.purpose&&c.example&&c.insight,title);
  assert.ok(c.symbols.length>=2,title);
 }
});

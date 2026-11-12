import test from 'node:test';
import assert from 'node:assert/strict';
let render=()=>'';try{({renderInlineReferences:render}=await import('../dist/references.mjs'))}catch{}
test('landscape terms link directly to their own source slides',()=>{
 const html=render('local minima, saddle points, steep cliffs, and nearly flat regions',1);
 assert.match(html,/data-slide="6"[^>]*>local minima<\/button>/);
 assert.match(html,/data-slide="7"[^>]*>saddle points<\/button>/);
 assert.match(html,/data-slide="8"[^>]*>steep cliffs<\/button>/);
 assert.doesNotMatch(html,/>nearly flat regions<\/button>/);
});
test('source linking preserves text and safely escapes unrelated markup',()=>{
 const html=render('<script> & saddle points',1);
 assert.ok(html.startsWith('&lt;script&gt; &amp; '));
 assert.doesNotMatch(html,/<script>/);
});
test('longer phrases take priority without nesting or partial-word links',()=>{
 const html=render('nonconvex convex convexity',1);
 assert.equal((html.match(/data-slide=/g)||[]).length,2);
 assert.match(html,/>nonconvex<\/button>/);
 assert.ok(html.endsWith(' convexity'));
});

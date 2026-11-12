import test from 'node:test';
import assert from 'node:assert/strict';
let api={}; try {api=await import('../dist/state.mjs')} catch {}
test('slide navigation clamps to original deck bounds',()=>{assert.equal(api.clampSlide?.(-1),1);assert.equal(api.clampSlide?.(99),44);assert.equal(api.clampSlide?.('bad'),1)});
test('progress restoration rejects corrupt or foreign values',()=>{assert.deepEqual(api.readProgress?.('invalid'),{completed:[],ratings:{}});assert.deepEqual(api.readProgress?.('{"completed":[0,99,2,2],"ratings":{"a":"bad","b":"again"}}'),{completed:[0,2],ratings:{b:'again'}})});
test('weak review includes again and unsure, excludes mastered and unseen',()=>{assert.deepEqual(api.reviewQueue?.([{id:'a'},{id:'b'},{id:'c'},{id:'d'}],{a:'again',b:'got',c:'unsure'},'weak').map(q=>q.id),['a','c'])});

test('legacy topic completion carries over to the lessons it fully covers', () => {
 const lessons=[
  {pages:[{topic:0},{topic:0}]},
  {pages:[{topic:0}]},
  {pages:[{topic:1},{topic:2}]}
 ];
 const legacy=JSON.stringify({completed:[0,1,99],ratings:{a:'got'}});
 assert.deepEqual(api.readLessonProgress?.(legacy,lessons,3),{version:2,completed:[0,1],ratings:{a:'got'}});
 const complete=JSON.stringify({completed:[0,1,2],ratings:{a:'got'}});
 assert.deepEqual(api.readLessonProgress?.(complete,lessons,3).completed,[0,1,2]);
 const saved=JSON.stringify({version:2,completed:[1],ratings:{a:'again'}});
 assert.deepEqual(api.readLessonProgress?.(saved,lessons,3),{version:2,completed:[1],ratings:{a:'again'}});
});

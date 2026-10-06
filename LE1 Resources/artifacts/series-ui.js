(() => {
  const order = [['01_overview_supervised.html','Overview + Supervised Learning'],['02_datasets_dataloaders.html','Datasets + Dataloaders'],['03_mlp.html','Multilayer Perceptrons'],['04_cnn.html','CNN'],['05_rnn.html','RNN'],['06_transformer.html','Transformer'],['07_llm_intro.html','LLM Intro'],['08_llm_data_model.html','LLM Data + Model'],['09_agents.html','Agents']];
  const current = location.pathname.split('/').pop(), index = order.findIndex(([file]) => file === current); if (index < 0) return;
  const header = document.querySelector('header');
  if (header && !header.querySelector('.topnav')) { const nav = document.createElement('nav'); nav.className='topnav'; nav.setAttribute('aria-label','Lecture navigation'); nav.innerHTML=(index?`<a href="${order[index-1][0]}">← Lecture ${String(index).padStart(2,'0')}: ${order[index-1][1]}</a>`:'<span>← Start of series</span>')+(index<order.length-1?`<a href="${order[index+1][0]}">Lecture ${String(index+2).padStart(2,'0')}: ${order[index+1][1]} →</a>`:'<span>End of series →</span>'); (header.querySelector('.wrap') || header).prepend(nav); }
  const main=document.querySelector('main'); if(!main||main.closest('.series-shell'))return;
  main.querySelectorAll(':scope > nav[aria-label^="Lecture navigation"], :scope > .toc[aria-label="On this page"]').forEach(node => node.remove());
  const sections=[...main.querySelectorAll(':scope > section')]; if(!sections.length)return;
  const toc=document.createElement('nav'); toc.className='series-toc'; toc.setAttribute('aria-label','On this page'); toc.innerHTML='<b>On this page</b>';
  sections.forEach((section,n)=>{const heading=section.querySelector('h2');if(!heading)return;if(!section.id)section.id=`section-${n+1}`;const a=document.createElement('a');a.href=`#${section.id}`;a.textContent=heading.textContent.replace(/^\d+\.\s*/,'');toc.append(a)});
  const shell=document.createElement('div');shell.className='series-shell';main.parentNode.insertBefore(shell,main);shell.append(toc,main);
  if(!main.querySelector('.series-bottomnav')){const bottom=document.createElement('nav');bottom.className='series-bottomnav';bottom.setAttribute('aria-label','Lecture navigation');bottom.innerHTML=(index?`<a href="${order[index-1][0]}">← Review ${order[index-1][1]}</a>`:'<span>Start of series</span>')+(index<order.length-1?`<a href="${order[index+1][0]}">Continue to ${order[index+1][1]} →</a>`:'<span>End of series</span>');main.append(bottom)}
})();

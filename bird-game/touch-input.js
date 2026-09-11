/* Local accessibility adaptation of Blockly Games. See NOTICE.md. */
(() => {
  let active = null;
  window.BlocklyTouchInput = window.BirdTouch = {
    open(value, commit, angle = false) {
      if (active) return;
      const en = window.BlocklyGamesLang === 'en';
      const previous = document.activeElement;
      const overlay = document.createElement('div');
      overlay.className = 'bird-keypad-overlay';
      overlay.innerHTML = `<section class="bird-keypad" role="dialog" aria-modal="true" aria-labelledby="keypad-title">
        <h2 id="keypad-title">${en ? (angle ? 'Heading (degrees)' : 'Number') : (angle ? '飛行角度（度）' : '座標數字')}</h2>
        <p>${en ? 'Tap the keys below. No keyboard needed.' : '直接點下面的按鍵，不需要叫出鍵盤。'}</p>
        <output aria-live="polite"></output><div class="bird-presets"></div>
        <div class="bird-digits"></div><p class="bird-error" role="alert"></p>
        <div class="bird-actions"><button data-action="cancel">${en ? 'Cancel' : '取消'}</button><button data-action="ok">${en ? 'Apply' : '確定'}</button></div>
      </section>`;
      const output = overlay.querySelector('output');
      let draft = String(value), replace = true;
      const render = () => { output.textContent = draft || '0'; };
      const button = (text, parent, action) => {
        const el = document.createElement('button');
        el.type = 'button'; el.textContent = text; el.onclick = action;
        parent.appendChild(el);
      };
      for (const number of angle ? [0, 45, 90, 135, 180, 270] : [0, 25, 50, 75, 100]) {
        button(String(number), overlay.querySelector('.bird-presets'), () => { draft = String(number); replace = true; render(); });
      }
      function edit(key) {
        if (key === '⌫') draft = draft.slice(0, -1);
        else if (key === 'C') draft = '';
        else if (key === '±') draft = draft.startsWith('-') ? draft.slice(1) : '-' + draft;
        else { if (replace) draft = ''; if (draft.length < 9 && (key !== '.' || !draft.includes('.'))) draft += key; }
        replace = false; render();
      }
      for (const key of ['7','8','9','4','5','6','1','2','3','C','0','⌫','±','.']) {
        button(key, overlay.querySelector('.bird-digits'), () => edit(key));
      }
      function close() {
        overlay.remove(); document.removeEventListener('keydown', keydown, true); active = null; previous?.focus();
      }
      function apply() {
        if (!draft.trim() || !Number.isFinite(Number(draft))) {
          overlay.querySelector('.bird-error').textContent = en ? 'Enter a valid number.' : '請輸入有效數字。'; return;
        }
        commit(draft); close();
      }
      function keydown(event) {
        if (/^[0-9.]$/.test(event.key)) { event.preventDefault(); edit(event.key); }
        else if (event.key === 'Backspace') { event.preventDefault(); edit('⌫'); }
        else if (event.key === 'Enter') { event.preventDefault(); apply(); }
        else if (event.key === 'Escape') { event.preventDefault(); close(); }
        else if (event.key === 'Tab') {
          const keys = [...overlay.querySelectorAll('button')];
          const first = keys[0], last = keys.at(-1);
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
        event.stopPropagation();
      }
      overlay.querySelector('[data-action="cancel"]').onclick = close;
      overlay.querySelector('[data-action="ok"]').onclick = apply;
      document.body.appendChild(overlay); active = overlay; render();
      document.addEventListener('keydown', keydown, true);
      overlay.querySelector('button').focus();
    },
    openPitch(value, commit) {
      if (active) return;
      const en = window.BlocklyGamesLang === 'en';
      const notes = ['C3','D3','E3','F3','G3','A3','B3','C4','D4','E4','F4','G4','A4'];
      const previous = document.activeElement;
      const overlay = document.createElement('div');
      overlay.className = 'bird-keypad-overlay';
      overlay.innerHTML = `<section class="bird-keypad" role="dialog" aria-modal="true" aria-labelledby="keypad-title">
        <h2 id="keypad-title">${en ? 'Choose a note' : '選擇音符'}</h2>
        <p>${en ? 'Tap a note. No keyboard needed.' : '直接點音符，不需要叫出鍵盤。'}</p>
        <output aria-live="polite"></output><div class="bird-presets bird-note-keys"></div>
        <div class="bird-actions"><button data-action="cancel">${en ? 'Cancel' : '取消'}</button><button data-action="ok">${en ? 'Apply' : '確定'}</button></div>
      </section>`;
      const output = overlay.querySelector('output');
      let selected = Number(value);
      const render = () => { output.textContent = notes[selected] || notes[0]; };
      const button = (text, parent, action) => {
        const el = document.createElement('button');
        el.type = 'button'; el.textContent = text; el.onclick = action;
        parent.appendChild(el);
      };
      notes.forEach((note, index) => button(note, overlay.querySelector('.bird-note-keys'), () => { selected = index; render(); }));
      const close = () => { overlay.remove(); active = null; previous?.focus(); };
      overlay.querySelector('[data-action="cancel"]').onclick = close;
      overlay.querySelector('[data-action="ok"]').onclick = () => { commit(selected); close(); };
      document.body.appendChild(overlay); active = overlay; render();
      overlay.querySelector('button').focus();
    }
  };

  function installMusicPitchFallback() {
    if (!/\/music\.html$/.test(window.location.pathname)) return;
    const notes = new Set(['C3','D3','E3','F3','G3','A3','B3','C4','D4','E4','F4','G4','A4']);
    const install = () => {
      const workspace = window.blocklyGamesMusicWorkspace || window.Blockly?.getMainWorkspace?.() || window.Blockly?.Workspace?.getAllWorkspaces?.()[0];
      if (!workspace) { window.setTimeout(install, 100); return; }
      const blocks = () => workspace.getAllBlocks?.(false) || workspace.Ka?.(false) || [];
      const handle = (event) => {
        const target = event.target;
        for (const block of blocks()) {
          for (const input of block.inputList || block.B || []) {
            for (const field of input.fieldRow || input.aa || []) {
              const root = field?.getSvgRoot?.() || field?.S?.();
              if (!root || !root.contains(target) || !notes.has(root.textContent.trim())) continue;
              event.preventDefault(); event.stopPropagation();
              window.BlocklyTouchInput.openPitch(Number(field.getValue()), (value) => field.setValue(value));
              return;
            }
          }
        }
      };
      document.addEventListener('mousedown', handle, true);
      document.addEventListener('touchstart', handle, true);
    };
    install();
  }

  installMusicPitchFallback();
})();

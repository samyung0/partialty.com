// src/components/_Index/codeBlock/astroCode.ts
var code = `---
import Button from './Button.astro';
import MyReactButton from './MyReactButton.jsx';
import MySvelteButton from './MySvelteButton.svelte';
---
<div>
  <Button />
  <MyReactButton client:idle />
  <MySvelteButton client:load />
</div>`;
var _astroCodeBlankChar = [0];
Array.from(code).forEach((char) => {
  if (char === "\n") _astroCodeBlankChar.push(0);
  else _astroCodeBlankChar[_astroCodeBlankChar.length - 1]++;
});
var astroCodeBlankChar = _astroCodeBlankChar;

// src/components/_Index/codeBlock/qwikCode.ts
var code2 = `import { component$ } from '@builder.io/qwik';
 
export default component$(() => {
  return <section>A Joke!</section>;
});`;
var _qwikCodeBlankChar = [0];
Array.from(code2).forEach((char) => {
  if (char === "\n") _qwikCodeBlankChar.push(0);
  else _qwikCodeBlankChar[_qwikCodeBlankChar.length - 1]++;
});
var qwikCodeBlankChar = _qwikCodeBlankChar;

// src/components/_Index/codeBlock/reactCode.ts
var code3 = `export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
    </div>
  );
}`;
var _reactCodeBlankChar = [0];
Array.from(code3).forEach((char) => {
  if (char === "\n") _reactCodeBlankChar.push(0);
  else _reactCodeBlankChar[_reactCodeBlankChar.length - 1]++;
});
var reactCodeBlankChar = _reactCodeBlankChar;

// src/components/_Index/codeBlock/reactCode2.ts
var code4 = `export default function MyApp() {
  return (
    <div class="flex h-[100%] w-full">
      <div class="w-[30%] bg-white"/>
      <div class="flex w-[70%] items-center bg-custom-yellow-400">
        <p class="m-8 text-[1.5em]">
          Let's learn web development
        </p>
      </div>
    </div>
  );
}`;
var _reactCode2BlankChar = [0];
Array.from(code4).forEach((char) => {
  if (char === "\n") _reactCode2BlankChar.push(0);
  else _reactCode2BlankChar[_reactCode2BlankChar.length - 1]++;
});
var reactCode2BlankChar = _reactCode2BlankChar;

// src/components/_Index/codeBlock/$blankChar.ts
var blankChar_default = () => {
  return {
    data: {
      astroCodeBlankChar,
      qwikCodeBlankChar,
      reactCodeBlankChar,
      reactCode2BlankChar,
    },
  };
};
export { blankChar_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2NvbXBvbmVudHMvX0luZGV4L2NvZGVCbG9jay9hc3Ryb0NvZGUudHMiLCAic3JjL2NvbXBvbmVudHMvX0luZGV4L2NvZGVCbG9jay9xd2lrQ29kZS50cyIsICJzcmMvY29tcG9uZW50cy9fSW5kZXgvY29kZUJsb2NrL3JlYWN0Q29kZS50cyIsICJzcmMvY29tcG9uZW50cy9fSW5kZXgvY29kZUJsb2NrL3JlYWN0Q29kZTIudHMiLCAic3JjL2NvbXBvbmVudHMvX0luZGV4L2NvZGVCbG9jay8kYmxhbmtDaGFyLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX2luamVjdGVkX2ZpbGVuYW1lX18gPSBcIi9ob21lL3NhbS9XRUIvcGFydGlhbHR5LXdzbC9zcmMvY29tcG9uZW50cy9fSW5kZXgvY29kZUJsb2NrL2FzdHJvQ29kZS50c1wiO2NvbnN0IF9faW5qZWN0ZWRfZGlybmFtZV9fID0gXCIvaG9tZS9zYW0vV0VCL3BhcnRpYWx0eS13c2wvc3JjL2NvbXBvbmVudHMvX0luZGV4L2NvZGVCbG9ja1wiO2NvbnN0IF9faW5qZWN0ZWRfaW1wb3J0X21ldGFfdXJsX18gPSBcImZpbGU6Ly8vaG9tZS9zYW0vV0VCL3BhcnRpYWx0eS13c2wvc3JjL2NvbXBvbmVudHMvX0luZGV4L2NvZGVCbG9jay9hc3Ryb0NvZGUudHNcIjsvLyBpbXBvcnQgcmVuZGVySW5kZXhDb2RlQmxvY2sgZnJvbSBcIn4vdXRpbHMvc2hpa2lqaS9yZW5kZXJJbmRleENvZGVCbG9ja1wiO1xuXG4vLyBtYWtlIHN1cmUgdGhlcmUgYXJlIG5vIGJsYW5rIGxpbmVzIGF0IHRoZSBzdGFydCBhbmQgZW5kIG9mIHRoZSBzdHJpbmcgISEhXG5jb25zdCBjb2RlID0gYC0tLVxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuL0J1dHRvbi5hc3Rybyc7XG5pbXBvcnQgTXlSZWFjdEJ1dHRvbiBmcm9tICcuL015UmVhY3RCdXR0b24uanN4JztcbmltcG9ydCBNeVN2ZWx0ZUJ1dHRvbiBmcm9tICcuL015U3ZlbHRlQnV0dG9uLnN2ZWx0ZSc7XG4tLS1cbjxkaXY+XG4gIDxCdXR0b24gLz5cbiAgPE15UmVhY3RCdXR0b24gY2xpZW50OmlkbGUgLz5cbiAgPE15U3ZlbHRlQnV0dG9uIGNsaWVudDpsb2FkIC8+XG48L2Rpdj5gO1xuXG4vLyBleHBvcnQgY29uc3QgYXN0cm9Db2RlUmVuZGVyZWQgPSByZW5kZXJJbmRleENvZGVCbG9jayh7IGNvZGUgfSk7XG5jb25zdCBfYXN0cm9Db2RlQmxhbmtDaGFyID0gWzBdO1xuQXJyYXkuZnJvbShjb2RlKS5mb3JFYWNoKChjaGFyOiBzdHJpbmcpID0+IHtcbiAgaWYgKGNoYXIgPT09IFwiXFxuXCIpIF9hc3Ryb0NvZGVCbGFua0NoYXIucHVzaCgwKTtcbiAgZWxzZSBfYXN0cm9Db2RlQmxhbmtDaGFyW19hc3Ryb0NvZGVCbGFua0NoYXIubGVuZ3RoIC0gMV0rKztcbn0pO1xuZXhwb3J0IGNvbnN0IGFzdHJvQ29kZUJsYW5rQ2hhciA9IF9hc3Ryb0NvZGVCbGFua0NoYXI7XG5leHBvcnQgZGVmYXVsdCBjb2RlO1xuIiwgImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL2hvbWUvc2FtL1dFQi9wYXJ0aWFsdHktd3NsL3NyYy9jb21wb25lbnRzL19JbmRleC9jb2RlQmxvY2svcXdpa0NvZGUudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiL2hvbWUvc2FtL1dFQi9wYXJ0aWFsdHktd3NsL3NyYy9jb21wb25lbnRzL19JbmRleC9jb2RlQmxvY2tcIjtjb25zdCBfX2luamVjdGVkX2ltcG9ydF9tZXRhX3VybF9fID0gXCJmaWxlOi8vL2hvbWUvc2FtL1dFQi9wYXJ0aWFsdHktd3NsL3NyYy9jb21wb25lbnRzL19JbmRleC9jb2RlQmxvY2svcXdpa0NvZGUudHNcIjsvLyBpbXBvcnQgcmVuZGVySW5kZXhDb2RlQmxvY2sgZnJvbSBcIn4vdXRpbHMvc2hpa2lqaS9yZW5kZXJJbmRleENvZGVCbG9ja1wiO1xuXG4vLyBtYWtlIHN1cmUgdGhlcmUgYXJlIG5vIGJsYW5rIGxpbmVzIGF0IHRoZSBzdGFydCBhbmQgZW5kIG9mIHRoZSBzdHJpbmcgISEhXG5jb25zdCBjb2RlID0gYGltcG9ydCB7IGNvbXBvbmVudCQgfSBmcm9tICdAYnVpbGRlci5pby9xd2lrJztcbiBcbmV4cG9ydCBkZWZhdWx0IGNvbXBvbmVudCQoKCkgPT4ge1xuICByZXR1cm4gPHNlY3Rpb24+QSBKb2tlITwvc2VjdGlvbj47XG59KTtgO1xuXG4vLyBleHBvcnQgY29uc3QgcXdpa0NvZGVSZW5kZXJlZCA9IHJlbmRlckluZGV4Q29kZUJsb2NrKHsgY29kZSB9KTtcbmNvbnN0IF9xd2lrQ29kZUJsYW5rQ2hhciA9IFswXTtcbkFycmF5LmZyb20oY29kZSkuZm9yRWFjaCgoY2hhcjogc3RyaW5nKSA9PiB7XG4gIGlmIChjaGFyID09PSBcIlxcblwiKSBfcXdpa0NvZGVCbGFua0NoYXIucHVzaCgwKTtcbiAgZWxzZSBfcXdpa0NvZGVCbGFua0NoYXJbX3F3aWtDb2RlQmxhbmtDaGFyLmxlbmd0aCAtIDFdKys7XG59KTtcbmV4cG9ydCBjb25zdCBxd2lrQ29kZUJsYW5rQ2hhciA9IF9xd2lrQ29kZUJsYW5rQ2hhcjtcbmV4cG9ydCBkZWZhdWx0IGNvZGU7XG4iLCAiY29uc3QgX19pbmplY3RlZF9maWxlbmFtZV9fID0gXCIvaG9tZS9zYW0vV0VCL3BhcnRpYWx0eS13c2wvc3JjL2NvbXBvbmVudHMvX0luZGV4L2NvZGVCbG9jay9yZWFjdENvZGUudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiL2hvbWUvc2FtL1dFQi9wYXJ0aWFsdHktd3NsL3NyYy9jb21wb25lbnRzL19JbmRleC9jb2RlQmxvY2tcIjtjb25zdCBfX2luamVjdGVkX2ltcG9ydF9tZXRhX3VybF9fID0gXCJmaWxlOi8vL2hvbWUvc2FtL1dFQi9wYXJ0aWFsdHktd3NsL3NyYy9jb21wb25lbnRzL19JbmRleC9jb2RlQmxvY2svcmVhY3RDb2RlLnRzXCI7Ly8gaW1wb3J0IHJlbmRlckluZGV4Q29kZUJsb2NrIGZyb20gXCJ+L3V0aWxzL3NoaWtpamkvcmVuZGVySW5kZXhDb2RlQmxvY2tcIjtcblxuLy8gbWFrZSBzdXJlIHRoZXJlIGFyZSBubyBibGFuayBsaW5lcyBhdCB0aGUgc3RhcnQgYW5kIGVuZCBvZiB0aGUgc3RyaW5nICEhIVxuY29uc3QgY29kZSA9IGBleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNeUFwcCgpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPGgxPldlbGNvbWUgdG8gbXkgYXBwPC9oMT5cbiAgICA8L2Rpdj5cbiAgKTtcbn1gO1xuXG4vLyBleHBvcnQgY29uc3QgcmVhY3RDb2RlUmVuZGVyZWQgPSByZW5kZXJJbmRleENvZGVCbG9jayh7IGNvZGUgfSk7XG5jb25zdCBfcmVhY3RDb2RlQmxhbmtDaGFyID0gWzBdO1xuQXJyYXkuZnJvbShjb2RlKS5mb3JFYWNoKChjaGFyOiBzdHJpbmcpID0+IHtcbiAgaWYgKGNoYXIgPT09IFwiXFxuXCIpIF9yZWFjdENvZGVCbGFua0NoYXIucHVzaCgwKTtcbiAgZWxzZSBfcmVhY3RDb2RlQmxhbmtDaGFyW19yZWFjdENvZGVCbGFua0NoYXIubGVuZ3RoIC0gMV0rKztcbn0pO1xuZXhwb3J0IGNvbnN0IHJlYWN0Q29kZUJsYW5rQ2hhciA9IF9yZWFjdENvZGVCbGFua0NoYXI7XG5leHBvcnQgZGVmYXVsdCBjb2RlO1xuIiwgImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL2hvbWUvc2FtL1dFQi9wYXJ0aWFsdHktd3NsL3NyYy9jb21wb25lbnRzL19JbmRleC9jb2RlQmxvY2svcmVhY3RDb2RlMi50c1wiO2NvbnN0IF9faW5qZWN0ZWRfZGlybmFtZV9fID0gXCIvaG9tZS9zYW0vV0VCL3BhcnRpYWx0eS13c2wvc3JjL2NvbXBvbmVudHMvX0luZGV4L2NvZGVCbG9ja1wiO2NvbnN0IF9faW5qZWN0ZWRfaW1wb3J0X21ldGFfdXJsX18gPSBcImZpbGU6Ly8vaG9tZS9zYW0vV0VCL3BhcnRpYWx0eS13c2wvc3JjL2NvbXBvbmVudHMvX0luZGV4L2NvZGVCbG9jay9yZWFjdENvZGUyLnRzXCI7Y29uc3QgY29kZSA9IGBleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNeUFwcCgpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzPVwiZmxleCBoLVsxMDAlXSB3LWZ1bGxcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ3LVszMCVdIGJnLXdoaXRlXCIvPlxuICAgICAgPGRpdiBjbGFzcz1cImZsZXggdy1bNzAlXSBpdGVtcy1jZW50ZXIgYmcteWVsbG93LTQwMFwiPlxuICAgICAgICA8cCBjbGFzcz1cIm0tOCB0ZXh0LVsxLjVlbV1cIj5cbiAgICAgICAgICBMZXQncyBsZWFybiB3ZWIgZGV2ZWxvcG1lbnRcbiAgICAgICAgPC9wPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59YDtcblxuLy8gZXhwb3J0IGNvbnN0IHJlYWN0Q29kZVJlbmRlcmVkID0gcmVuZGVySW5kZXhDb2RlQmxvY2soeyBjb2RlIH0pO1xuY29uc3QgX3JlYWN0Q29kZTJCbGFua0NoYXIgPSBbMF07XG5BcnJheS5mcm9tKGNvZGUpLmZvckVhY2goKGNoYXI6IHN0cmluZykgPT4ge1xuICBpZiAoY2hhciA9PT0gXCJcXG5cIikgX3JlYWN0Q29kZTJCbGFua0NoYXIucHVzaCgwKTtcbiAgZWxzZSBfcmVhY3RDb2RlMkJsYW5rQ2hhcltfcmVhY3RDb2RlMkJsYW5rQ2hhci5sZW5ndGggLSAxXSsrO1xufSk7XG5leHBvcnQgY29uc3QgcmVhY3RDb2RlMkJsYW5rQ2hhciA9IF9yZWFjdENvZGUyQmxhbmtDaGFyO1xuZXhwb3J0IGRlZmF1bHQgY29kZTtcbiIsICJjb25zdCBfX2luamVjdGVkX2ZpbGVuYW1lX18gPSBcIi9ob21lL3NhbS9XRUIvcGFydGlhbHR5LXdzbC9zcmMvY29tcG9uZW50cy9fSW5kZXgvY29kZUJsb2NrLyRibGFua0NoYXIudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiL2hvbWUvc2FtL1dFQi9wYXJ0aWFsdHktd3NsL3NyYy9jb21wb25lbnRzL19JbmRleC9jb2RlQmxvY2tcIjtjb25zdCBfX2luamVjdGVkX2ltcG9ydF9tZXRhX3VybF9fID0gXCJmaWxlOi8vL2hvbWUvc2FtL1dFQi9wYXJ0aWFsdHktd3NsL3NyYy9jb21wb25lbnRzL19JbmRleC9jb2RlQmxvY2svJGJsYW5rQ2hhci50c1wiO2ltcG9ydCB0eXBlIGNvZGVCbG9jayBmcm9tIFwifi9jb21wb25lbnRzL19JbmRleC9jb2RlQmxvY2tcIjtcbmltcG9ydCB7IGFzdHJvQ29kZUJsYW5rQ2hhciB9IGZyb20gXCJ+L2NvbXBvbmVudHMvX0luZGV4L2NvZGVCbG9jay9hc3Ryb0NvZGVcIjtcbmltcG9ydCB7IHF3aWtDb2RlQmxhbmtDaGFyIH0gZnJvbSBcIn4vY29tcG9uZW50cy9fSW5kZXgvY29kZUJsb2NrL3F3aWtDb2RlXCI7XG5pbXBvcnQgeyByZWFjdENvZGVCbGFua0NoYXIgfSBmcm9tIFwifi9jb21wb25lbnRzL19JbmRleC9jb2RlQmxvY2svcmVhY3RDb2RlXCI7XG5pbXBvcnQgeyByZWFjdENvZGUyQmxhbmtDaGFyIH0gZnJvbSBcIi4vcmVhY3RDb2RlMlwiO1xuXG5leHBvcnQgZGVmYXVsdCAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgZGF0YToge1xuICAgICAgYXN0cm9Db2RlQmxhbmtDaGFyLFxuICAgICAgcXdpa0NvZGVCbGFua0NoYXIsXG4gICAgICByZWFjdENvZGVCbGFua0NoYXIsXG4gICAgICByZWFjdENvZGUyQmxhbmtDaGFyLFxuICAgIH0sXG4gIH0gYXMgeyBkYXRhOiBSZWNvcmQ8YCR7a2V5b2YgdHlwZW9mIGNvZGVCbG9ja31CbGFua0NoYXJgLCBudW1iZXJbXT4gfTtcbn07XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBR0EsSUFBTSxPQUFPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBWWIsSUFBTSxzQkFBc0IsQ0FBQyxDQUFDO0FBQzlCLE1BQU0sS0FBSyxJQUFJLEVBQUUsUUFBUSxDQUFDLFNBQWlCO0FBQ3pDLE1BQUksU0FBUztBQUFNLHdCQUFvQixLQUFLLENBQUM7QUFBQTtBQUN4Qyx3QkFBb0Isb0JBQW9CLFNBQVMsQ0FBQztBQUN6RCxDQUFDO0FBQ00sSUFBTSxxQkFBcUI7OztBQ2pCbEMsSUFBTUEsUUFBTztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBT2IsSUFBTSxxQkFBcUIsQ0FBQyxDQUFDO0FBQzdCLE1BQU0sS0FBS0EsS0FBSSxFQUFFLFFBQVEsQ0FBQyxTQUFpQjtBQUN6QyxNQUFJLFNBQVM7QUFBTSx1QkFBbUIsS0FBSyxDQUFDO0FBQUE7QUFDdkMsdUJBQW1CLG1CQUFtQixTQUFTLENBQUM7QUFDdkQsQ0FBQztBQUNNLElBQU0sb0JBQW9COzs7QUNaakMsSUFBTUMsUUFBTztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVNiLElBQU0sc0JBQXNCLENBQUMsQ0FBQztBQUM5QixNQUFNLEtBQUtBLEtBQUksRUFBRSxRQUFRLENBQUMsU0FBaUI7QUFDekMsTUFBSSxTQUFTO0FBQU0sd0JBQW9CLEtBQUssQ0FBQztBQUFBO0FBQ3hDLHdCQUFvQixvQkFBb0IsU0FBUyxDQUFDO0FBQ3pELENBQUM7QUFDTSxJQUFNLHFCQUFxQjs7O0FDakIyUixJQUFNQyxRQUFPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWMxVSxJQUFNLHVCQUF1QixDQUFDLENBQUM7QUFDL0IsTUFBTSxLQUFLQSxLQUFJLEVBQUUsUUFBUSxDQUFDLFNBQWlCO0FBQ3pDLE1BQUksU0FBUztBQUFNLHlCQUFxQixLQUFLLENBQUM7QUFBQTtBQUN6Qyx5QkFBcUIscUJBQXFCLFNBQVMsQ0FBQztBQUMzRCxDQUFDO0FBQ00sSUFBTSxzQkFBc0I7OztBQ2JuQyxJQUFPLG9CQUFRLE1BQU07QUFDbkIsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLE1BQ0o7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGOyIsCiAgIm5hbWVzIjogWyJjb2RlIiwgImNvZGUiLCAiY29kZSJdCn0K
#!/usr/bin/env node
import { Command as $ } from "commander";
import c from "path";
import { existsSync as g, promises as d } from "fs";
import { createSpinner as y } from "nanospinner";
import O from "json-to-ts";
import x from "prettier";
import T from "chalk";
import F from "translate";
class p {
  static error(e) {
    console.log(`${T.red(e)}`);
  }
  static log(e) {
    console.log(e);
  }
}
class k {
  inputParams = {
    from: "",
    to: [],
    dir: "",
    skipExisting: !1,
    genType: "",
    diff: ["", ""]
  };
  setInputParams(e) {
    this.inputParams = e;
  }
  getInputParams() {
    return this.inputParams;
  }
}
const l = new k();
async function b(o, e, t) {
  const { from: s, skipExisting: i } = l.getInputParams();
  for (let [n, r] of Object.entries(o))
    if (typeof r == "object")
      e[n] = e[n] || {}, await b(r, e[n], t);
    else
      try {
        e[n] && i || (e[n] = await F(r, {
          from: s,
          to: t
        }));
      } catch (a) {
        console.log(`
`), p.error(a.message), process.exit(1);
      }
}
const P = (o) => {
  const { dir: e } = l.getInputParams();
  return new Promise(async (t, s) => {
    let i = {};
    const n = await K(), r = c.join(process.cwd(), e, `${o}.json`);
    g(r) && (i = await u(r)), await b(n, i, o), t(i);
  });
};
async function h() {
  const { dir: o, genType: e } = l.getInputParams(), t = y("Creating language type file").start(), s = u(
    c.join(process.cwd(), o, `${e}.json`)
  ), i = O(s, {
    rootName: "GlobalTranslationType"
  }), n = c.join(process.cwd(), o, "types");
  g(n) || await d.mkdir(n);
  const r = c.join(n, "index"), a = `
    type NestedKeyOf<ObjectType extends object> = {
    [Key in keyof ObjectType & string]: ObjectType[Key] extends object
      ? // @ts-ignore
        \`\${Key}.\${NestedKeyOf<ObjectType[Key]>}\`
      : \`\${Key}\`
    }[keyof ObjectType & string]

    export type GlobalTranslation = NestedKeyOf<GlobalTranslationType>;

    ${i.join(`

`)}
  `, f = await x.format(a, {
    parser: "typescript"
  });
  await d.writeFile(r, f), t.success({ text: "Language type file created" });
}
async function I() {
  const { to: o, dir: e } = l.getInputParams();
  let t, s, i;
  for (let n of o)
    s = c.join(process.cwd(), e, `${n}.json`), t = y(`Translating to ${n}...`).start(), i = await P(n), await d.writeFile(s, JSON.stringify(i, null, 2)), t.success({ text: "Complete" });
}
async function u(o) {
  return JSON.parse(await d.readFile(o, { encoding: "utf-8" }));
}
function K() {
  const { dir: o, from: e } = l.getInputParams(), t = c.join(process.cwd(), o, `${e}.json`);
  return u(t);
}
function v(o, e) {
  const t = [];
  function s(i, n, r = "") {
    for (let [a, f] of Object.entries(i)) {
      const m = r ? `${r}.${a}` : a;
      typeof f == "object" ? n[a] ? s(f, n[a], m) : t.push(m) : n[a] || t.push(m);
    }
  }
  return s(o, e), t;
}
async function C() {
  const o = y("Comparing language files").start(), { dir: e, diff: t } = l.getInputParams(), s = t[0], i = t[1], n = await u(
    c.join(process.cwd(), e, `${s}.json`)
  ), r = await u(
    c.join(process.cwd(), e, `${i}.json`)
  ), a = v(n, r);
  p.log(`
Missing keys in ${i}.json compared to ${s}.json
`), p.log(a.join(`
`) || "No missing keys"), o.success({ text: "Comparison complete" });
}
function N(o) {
  Object.keys(o).length || (p.error('Invalid arguments. Use "--help" for usage'), process.exit(1));
  const { to: e, from: t, dir: s, genType: i, diff: n } = o;
  (t && !e || e && !t) && (p.error('"--from" and "--to" are dependent options'), process.exit(1));
  const r = c.join(process.cwd(), s, `${t}.json`), a = c.join(process.cwd(), s, `${i}.json`);
  if (!g(r) && t && (p.error(`File "${r}" not found`), process.exit(1)), !g(a) && i && (p.error(`File "${a}" not found`), process.exit(1)), n) {
    n.length !== 2 && (p.error('"--diff" option requires two languages'), process.exit(1));
    const [f, m] = n, j = c.join(process.cwd(), s, `${f}.json`), w = c.join(process.cwd(), s, `${m}.json`);
    g(j) || (p.error(`File "${j}" not found`), process.exit(1)), g(w) || (p.error(`File "${w}" not found`), process.exit(1));
  }
}
async function S() {
  const e = (await u(c.join(process.cwd(), "package.json"))).version, t = new $();
  t.name("auto-lang").description("Generate translation files for multiple languages (i18n)").version(e).option("-f, --from <lang>", "language to translate from").option(
    "-t, --to <lang...>",
    "languages to translate to (seperated by space)"
  ).option(
    "-d, --dir <directory>",
    "directory containing the language files",
    "translations"
  ).option("-s, --skip-existing", "skip existing keys during translation").option("-g, --gen-type <lang>", "generate types from language file").option(
    "-d, --diff <lang...>",
    "show missing keys between two language files"
  ).parse(), N(t.opts()), l.setInputParams(t.opts());
  const { from: s, to: i, genType: n, diff: r } = l.getInputParams();
  s && i && await I(), n && await h(), r && await C();
}
S();

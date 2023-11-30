import { cv, CV } from "../src/cv";
import { PEOPLE } from "../src/people";
import { promises as fs } from "fs";
import * as path from "path";

interface TwoColumnItem {
  left: string[];
  right: string[];
}

function* toIterator<T>(iter: Iterable<T>): IterableIterator<T> {
  yield* iter;
}

function zip<T, U>(
  iterA: Iterable<T>,
  iterB: Iterable<U>
): IterableIterator<[T, U]>;
function* zip<T>(
  ...iters: Iterable<T | undefined>[]
): IterableIterator<(T | undefined)[]> {
  const iterators = iters.map(toIterator);
  while (true) {
    const res: (T | undefined)[] = [];
    let doneCount = 0;
    for (const iterator of iterators) {
      const next = iterator.next();
      if (next.done) {
        res.push(undefined);
        doneCount++;
      }
      res.push(next.value);
    }
    if (doneCount === iterators.length) {
      return;
    }
    yield res;
  }
}

function makeTable(items: TwoColumnItem[], additionalNewlineCount = 0) {
  let latex = "\\begin{longtable}{Xr}\n";
  for (const { left, right } of items) {
    for (const [l, r] of zip(left, right)) {
      latex += `\t${l || ""} & ${r || ""} \\\\\n`;
    }
    for (let i = 0; i < additionalNewlineCount; i++) {
      latex += "\t\\\\\n\n";
    }
  }
  latex += "\\end{longtable}";
  return latex;
}

function escapeLatex(str: string): string {
  str = str.replace(/~/g, "\\textasciitilde");
  str = str.replace(/%/g, "\\%");
  return str;
}

function bold(str: string): string {
  return `\\textbf{${str}}`;
}

function italic(str: string): string {
  return `\\textit{${str}}`;
}

function boldami(str: string): string {
  return str === "Amy Pavel" ? bold(str) : str;
}

function authorsString(authors: string[]): string {
  return authors
    .map((id) => {
      const person = PEOPLE.get(id);
      if (!person) {
        throw new Error(`No person with id ${id}`);
      }
      return boldami(person.name);
    })
    .join(", ");
}

function workItems(resume: CV): TwoColumnItem[] {
  const items: TwoColumnItem[] = [];
  const work = resume.work;
  for (const {
    name,
    description,
    position,
    summary,
    location,
    startDate,
    endDate,
  } of work) {
    const left = [
      `${bold(name)}, ${description} -- ${italic(position)}`,
      summary ?? "",
    ];
    let start = startDate;
    let tryEnd = true;
    const parsedStart = new Date(startDate).getUTCFullYear();
    if (!isNaN(parsedStart)) {
      start = parsedStart.toString();
    } else {
      tryEnd = false;
    }
    let end = tryEnd ? "Present" : undefined;
    if (endDate && tryEnd) {
      end = `${new Date(endDate).getUTCFullYear()}`;
    }
    const combinedDate = end === undefined ? start : `${start}-${end}`;
    const right = [bold(location), combinedDate];
    items.push({ left, right });
  }
  return items;
}

function publicationItems(resume: CV, filterTags: string[]): TwoColumnItem[] {
  return resume.publications
    .filter(({ tags }) => tags.some((tag) => filterTags.some((t) => t === tag)))
    .map(({ authors, summary, name, publisher, releaseDate, tags }) => {
      let leftMatter = `${authorsString(authors)}. \`\`${name}'' ${italic(
        publisher
      )}`;
      if (summary) {
        leftMatter += ` ${summary}`;
      }
      if (tags.includes("bestpaper")) {
        leftMatter += ` --- ${bold("Best Paper Award")}`;
      }
      if (tags.includes("honorablemention")) {
        leftMatter += ` --- ${bold("Best Paper Honorable Mention Award")}`;
      }
      const left = [leftMatter];
      const date = new Date(releaseDate);
      let dateStr = releaseDate;
      if (!isNaN(date.getUTCFullYear())) {
        dateStr = date.toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        });
      }
      const right = [dateStr];
      return { left, right };
    });
}

function awardItems(resume: CV): TwoColumnItem[] {
  return resume.awards.map(({ title, awarder, date, summary }) => {
    let leftMatter = title;
    if (awarder) {
      leftMatter += ` (${awarder})`;
    }
    if (summary) {
      leftMatter += ` -- ${italic(summary)}`;
    }
    return {
      left: [leftMatter],
      right: [date],
    };
  });
}

function serviceItems({ volunteer }: CV): TwoColumnItem[] {
  let items: TwoColumnItem[] = [];

  const pcLeft = [bold("Program Committees")];
  const pcRight = [""];
  for (const { position, organization, startDate = "" } of volunteer.filter(
    ({ tags }) => tags.includes("pc")
  )) {
    pcLeft.push(`${organization} ${position}`);
    pcRight.push(startDate);
  }
  items.push({ left: pcLeft, right: pcRight });

  const svLeft = [bold("Student Volunteering")];
  const svRight = [""];
  for (const { organization, position, startDate = "" } of volunteer.filter(
    ({ tags }) => tags.includes("sv")
  )) {
    svLeft.push(`${organization}, ${position}`);
    svRight.push(startDate);
  }
  items.push({ left: svLeft, right: svRight });

  const deptLeft = [bold("Department Committees")];
  const deptRight = [""];
  for (const { organization, position, startDate = "" } of volunteer.filter(
    ({ tags }) => tags.includes("department")
  )) {
    deptLeft.push(`${position} (${organization})`);
    deptRight.push(startDate);
  }
  items.push({ left: deptLeft, right: deptRight });

  const prLeft = [bold("Peer Review")];
  const prRight = [""];
  for (const { organization, summary } of volunteer.filter(({ tags }) =>
    tags.includes("peer-review")
  )) {
    prLeft.push(`${organization} -- ${summary}`);
    prRight.push("");
  }
  items.push({ left: prLeft, right: prRight });

  const commLeft = [bold("Local and Online Community")];
  const commRight = [""];
  for (const { position, organization, startDate = "" } of volunteer.filter(
    ({ tags }) => tags.includes("community")
  )) {
    commLeft.push(`${position} -- ${organization}`);
    commRight.push(startDate);
  }
  items.push({ left: commLeft, right: commRight });

  return items;
}

function teachingItems({ teaching }: CV): TwoColumnItem[] {
  return teaching.map(
    ({ course, position, summary, startDate = "", endDate }) => {
      const left = [`${bold(course)} -- ${position}`, ...summary];
      let dateStr = startDate;
      if (endDate) {
        dateStr += `-${endDate}`;
      }
      return { left, right: [dateStr] };
    }
  );
}

function mentorshipItems({ mentorship }: CV): TwoColumnItem[] {
  return mentorship.map(({ name, summary, startDate, project }) => ({
    left: [`${name}. \`\`${project}''`, summary],
    right: [startDate],
  }));
}

function talkItems({ talks }: CV): TwoColumnItem[] {
  return talks.map(({ title, location, date, venue }) => ({
    left: [`\`\`${title}'' ${italic(venue)}. ${location}.`],
    right: [date],
  }));
}

function pressItems({ press }: CV): TwoColumnItem[] {
  return press.map(({ title, publisher, date, author }) => {
    const dateStr = new Date(date).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
    return {
      left: [`\`\`${title}'' ${author}, ${italic(publisher)}.`],
      right: [dateStr],
    };
  });
}

async function writeTables(): Promise<void> {
  const dir = path.join(__dirname, "cv-tables");
  await Promise.all(
    [
      ["work", escapeLatex(makeTable(workItems(cv), 1))],
      [
        "publications",
        escapeLatex(makeTable(publicationItems(cv, ["paper"]), 1)),
      ],
      [
        "posters",
        escapeLatex(
          makeTable(publicationItems(cv, ["poster", "demo", "workshop"]), 1)
        ),
      ],
      [
        "tech-reports",
        escapeLatex(
          makeTable(
            publicationItems(cv, ["tech-report", "thesis", "preprint"]),
            1
          )
        ),
      ],
      ["awards", escapeLatex(makeTable(awardItems(cv)))],
      ["service", escapeLatex(makeTable(serviceItems(cv), 1))],
      ["teaching", escapeLatex(makeTable(teachingItems(cv), 1))],
      ["mentorship", escapeLatex(makeTable(mentorshipItems(cv), 1))],
      ["talks", escapeLatex(makeTable(talkItems(cv), 1))],
      ["press", escapeLatex(makeTable(pressItems(cv), 1))],
    ].map(async ([filename, contents]) => {
      await fs.writeFile(path.join(dir, `${filename}.tex`), contents, "utf8");
      console.log(`Wrote ${filename}.tex`);
    })
  );
}

writeTables();

import React from "react";
import { StaticImage } from "gatsby-plugin-image";
import { graphql } from "gatsby";
import PubComponent, {
  RawPeopleIdList,
  PeopleList,
  pubHonor,
} from "../components/Pub";
import { cv } from "../cv";
import { PEOPLE } from "../people";
import WorkComponent from "../components/Work";
import TeachingComponent from "../components/Teaching";
import HighlightComponent from "../components/Highlight";
import parse from "date-fns/parse";
import ReactMarkdown from "react-markdown";
import AmyPavelSmall from "../images/amypavel-small.png";

function sortByDate<T>(items: T[], key: keyof T): T[] {
  return [...items].sort((a, b) => {
    const dateA = parse(a[key] as string, "MM-dd-yyyy", new Date());
    const dateB = parse(b[key] as string, "MM-dd-yyyy", new Date());
    return dateA.getTime() - dateB.getTime();
  });
}

export default function IndexPage({ data }) {
  const aboutHtml = data.about.children[0].html;
  const researchHtml = data.research.children[0].html;
  const pubs = sortByDate(cv.publications, "releaseDate").reverse();
  const today = new Date();
  const preprints = pubs.filter((pub) => {
    const pubDate = parse(pub.releaseDate, "MM-dd-yyyy", new Date());
    return pubDate > today;
  });
  const publishedPapers = pubs.filter((pub) => {
    const pubDate = parse(pub.releaseDate, "MM-dd-yyyy", new Date());
    return pubDate <= today;
  });
  return (
    <div className="sm:container sm:mx-auto px-10 md:px-30 lg:px-30 xl:px-40 py-10 text">
      <h1 className="text-4xl py-8">Amy Pavel</h1>
      <div className="md:grid md:grid-cols-4 md:gap-x-4">
        <div className="col-span-1 mb-10">
          <div className="w-48 h-52 md:h-auto md:w-auto">
            {/* using img instead of StaticImage to avoid the fade-in */}
            <img
              className="w-48 md:h-auto md:w-auto"
              src={AmyPavelSmall}
              alt="Amy Pavel headshot"
            />
          </div>
          <div className="py-6">
            <p>
              Assistant Professor
              <br />
              <a href="https://berkeley.edu">UC Berkeley</a>
              <br />
              <a href="https://eecs.berkeley.edu/">
                Electrical Engineering and Computer Sciences
              </a>
            </p>
          </div>
          <div className="pb-7">
            <p>
              Email{" "}
              <a href="mailto:amypavel@berkeley.edu">amypavel@berkeley.edu</a>
            </p>
            <p>
              Office{" "}
              <a href="https://www.berkeley.edu/map/sutardja-dai-hall/">
                SDH 415
              </a>
            </p>
            <p>
              Twitter <a href="https://twitter.com/amypavel">@amypavel</a>
            </p>
            {/* <p>
              Bluesky{" "}
              <a href="https://bsky.app/profile/amypavel.bsky.social">
                @amypavel.bsky.social
              </a>
            </p>
            <p>
              <a href="https://www.linkedin.com/in/amy-pavel-02871821/">
                LinkedIn
              </a>
            </p> */}
            <p>
              Publications{" "}
              <a href="https://scholar.google.com/citations?user=bM4pEGoAAAAJ&hl=en">
                Google Scholar
              </a>
            </p>
            <p>
              Curriculum Vitae <a href="docs/pavel-cv.pdf">PDF</a>
            </p>
          </div>

          <div className="pb-7">
            <p>
              <b>Research Group</b>
              <br></br>
              <em>Ph.D. Students:</em>{" "}
              <RawPeopleIdList
                peopleIds={[
                  "mhuh",
                  "kbenharrak",
                  "agmohanbabu",
                  "mchen",
                  "ypeng",
                ]}
              />{" "}
              (co-advised with <RawPeopleIdList peopleIds={["jbigham"]} />)
              <br></br>
              <em>Masters and Undergraduates:</em>{" "}
              <RawPeopleIdList
                peopleIds={[
                  "abarua",
                  "aiyer",
                  "kclark",
                  "salbedaiwi",
                  "udas",
                  "jhe",
                  "szheng",
                ]}
              />
              <br></br>
              <em>Recent Alumni:</em>{" "}
              <RawPeopleIdList
                peopleIds={[
                  "dlee",
                  "pvenkatesh",
                  "tvandaele",
                  "yzhang",
                  "dkillough",
                  "jderry",
                  "ajiao",
                  "skole",
                  "cgupta",
                ]}
              />
              <br></br>
              {/*<em>Recent Collaborators:</em>*/}
            </p>
          </div>
          {/*<div>*/}
          {/*  <p>*/}
          {/*    Archived job materials*/}
          {/*    <br />*/}
          {/*    <a href="docs/pavel-research.pdf">Research</a> ·{" "}*/}
          {/*    <a href="docs/pavel-teaching.pdf">Teaching</a>*/}
          {/*  </p>*/}
          {/*</div>*/}
        </div>
        <div className="col-span-3">
          <div
            className="writing"
            dangerouslySetInnerHTML={{ __html: aboutHtml }}
          />
          <div className="bg-blue-50 text-blue-900 border border-blue-200 rounded-lg p-6 my-4">
            {/*<b>Getting Involved</b>*/}
            {/*<br></br>*/}
            {/*<br></br>*/}
            <p>
              <b>Current UC Berkeley Students</b>: I am actively recruiting UC
              Berkeley students for research positions in my lab! Check out{" "}
              <a href="">this document</a> to learn more and apply.
            </p>
            <br></br>
            <p>
              <b>Prospective Students, Visitors, Interns, and Postdocs</b>: I
              recruit PhD students every year. Please apply directly to the{" "}
              <a href="https://eecs.berkeley.edu/academics/graduate/research-programs/admissions/">
                UC Berkeley EECS PhD program
              </a>{" "}
              and list me as a potential advisor. For other questions or
              positions, please read{" "}
              <a href="https://docs.google.com/document/u/4/d/e/2PACX-1vSsB-lcy4Syh1TUVGyWECn9u2wD5BzrEIilDGroVR9Ct82z0EU6ZTpfcMM69JHlIG2930X1yVFKtbHg/pub">
                these FAQs
              </a>{" "}
              before reaching out.
            </p>
          </div>
          <h2 className="text-2xl font-medium pb-7 pt-8">
            Research Highlights
          </h2>
          <div className="container">
            <div className="sm:grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              {publishedPapers
                .filter((pub) => pub.tags.includes("highlight"))
                .sort(
                  (a, b) =>
                    (a.highlightSortOrder ?? Infinity) -
                    (b.highlightSortOrder ?? Infinity)
                )
                .map((pub) => (
                  <div className="col-span-1 pb-4 sm:pb-0">
                    <HighlightComponent
                      title={pub.shortName ?? pub.name}
                      subtitle={
                        pub.publisher +
                        (pubHonor(pub) ? " – " + pubHonor(pub) : "")
                      }
                      imageName={pub.image}
                      imageAlt={pub.imageAlt}
                    >
                      <ReactMarkdown>{pub.content ?? ""}</ReactMarkdown>
                    </HighlightComponent>
                  </div>
                ))}
            </div>
          </div>
          <h2 className="text-2xl font-medium pb-7 pt-8">Research Summary</h2>
          <div
            className="writing"
            dangerouslySetInnerHTML={{ __html: researchHtml }}
          />
          {preprints.filter((p) => p.tags.includes("paper")).length > 0 && (
            <>
              <h2 className="text-2xl font-medium pb-7 pt-8">Preprints</h2>
              <div className="md:container md:mx-auto">
                {preprints
                  .filter((p) => p.tags.includes("paper"))
                  .map((pub) => (
                    <PubComponent key={pub.name} pub={pub} />
                  ))}
              </div>
            </>
          )}
          <h2 className="text-2xl font-medium pb-7 pt-8">Research Papers</h2>
          <div className="md:container md:mx-auto">
            {publishedPapers
              .filter((p) => p.tags.includes("paper"))
              .map((pub) => (
                <PubComponent key={pub.name} pub={pub} />
              ))}
          </div>
          <h2 className="text-2xl font-medium pb-7 pt-8">
            Thesis and Technical Reports
          </h2>
          <div className="md:container md:mx-auto">
            {publishedPapers
              .filter((p) => p.tags.includes("tech-report"))
              .map((pub) => (
                <PubComponent key={pub.name} pub={pub} />
              ))}
          </div>
          <h2 className="text-2xl font-medium pb-7 pt-8">
            Posters, Demos, and Workshops
          </h2>
          <div className="md:container md:mx-auto">
            {publishedPapers
              .filter(
                (p) => p.tags.includes("poster") || p.tags.includes("workshop")
              )
              .map((pub) => (
                <PubComponent key={pub.name} pub={pub} />
              ))}
          </div>
          <h2 className="text-2xl font-medium pb-7 pt-8">Work</h2>
          {cv.work.map((job) => (
            <WorkComponent key={job.name} work={job} />
          ))}
          <h2 className="text-2xl font-medium pb-7 pt-8">Teaching</h2>
          {cv.teaching.map((teaching, i) => (
            <TeachingComponent key={i} teaching={teaching} />
          ))}
        </div>
      </div>
    </div>
  );
}

export const pageQuery = graphql`
  query MyQuery {
    about: file(name: { eq: "about" }, sourceInstanceName: { eq: "content" }) {
      id
      children {
        id
        ... on MarkdownRemark {
          id
          html
        }
      }
    }
    research: file(
      name: { eq: "research" }
      sourceInstanceName: { eq: "content" }
    ) {
      id
      children {
        id
        ... on MarkdownRemark {
          id
          html
        }
      }
    }
  }
`;

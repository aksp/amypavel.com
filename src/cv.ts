import * as t from "io-ts";
import cvJson from "./data/cv.json";
import { fold } from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { formatValidationErrors } from "io-ts-reporters";

const Work = t.intersection([
  t.type({
    name: t.string,
    description: t.string,
    position: t.string,
    location: t.string,
    startDate: t.string,
  }),
  t.partial({
    summary: t.string,
    endDate: t.string,
  }),
]);

const Publication = t.intersection([
  t.type({
    authors: t.array(t.string),
    name: t.string,
    releaseDate: t.string,
    publisher: t.string, // venueShort
    tags: t.array(
      t.keyof({
        paper: null,
        poster: null,
        preprint: null,
        workshop: null,
        "tech-report": null,
        highlight: null,
        bestpaper: null,
        honorablemention: null,
        "oral-spotlight": null,
      })
    ),
  }),
  t.partial({
    venueFull: t.string,
    summary: t.string,
    link: t.string,
    image: t.string,
    imageAlt: t.string,
    content: t.string,
    shortName: t.string, // name used for highlights
  }),
]);

const Award = t.intersection([
  t.type({
    title: t.string,
    date: t.string,
  }),
  t.partial({
    awarder: t.string,
    summary: t.string,
  }),
]);

const Volunteer = t.intersection([
  t.type({
    position: t.string,
    organization: t.string,
    tags: t.array(t.string),
  }),
  t.partial({
    startDate: t.string,
    summary: t.string,
  }),
]);

const Teaching = t.intersection([
  t.type({
    position: t.string,
    course: t.string,
    summary: t.array(t.string),
    institution: t.string,
  }),
  t.partial({
    link: t.string,
    startDate: t.string,
    endDate: t.string,
  }),
]);

const Mentorship = t.intersection([
  t.type({
    name: t.string,
    summary: t.string,
    startDate: t.string,
  }),
  t.partial({
    project: t.string,
  }),
]);

const Talk = t.type({
  title: t.string,
  venue: t.string,
  location: t.string,
  date: t.string,
});

const Press = t.type({
  title: t.string,
  author: t.string,
  publisher: t.string,
  date: t.string,
});

const ThesisCommittee = t.type({
  name: t.string,
  startDate: t.string,
  summary: t.string,
  tags: t.array(t.string),
});

const CV = t.type({
  work: t.array(Work),
  publications: t.array(Publication),
  awards: t.array(Award),
  volunteer: t.array(Volunteer),
  teaching: t.array(Teaching),
  undergraduate_and_masters_mentorship: t.array(Mentorship),
  phd_mentorship: t.array(Mentorship),
  talks: t.array(Talk),
  press: t.array(Press),
  thesis_committees: t.array(ThesisCommittee),
});

export type CV = t.TypeOf<typeof CV>;
export type Publication = t.TypeOf<typeof Publication>;
export type Work = t.TypeOf<typeof Work>;
export type Award = t.TypeOf<typeof Award>;
export type Volunteer = t.TypeOf<typeof Volunteer>;
export type Teaching = t.TypeOf<typeof Teaching>;
export type Mentorship = t.TypeOf<typeof Mentorship>;
export type Talk = t.TypeOf<typeof Talk>;
export type Press = t.TypeOf<typeof Press>;
export type ThesisCommittee = t.TypeOf<typeof ThesisCommittee>;

export let cv: CV;

pipe(
  CV.decode(cvJson),
  fold(
    (err) => {
      console.error(formatValidationErrors(err));
      throw err[0];
    },
    (_cv) => {
      cv = _cv;
    }
  )
);

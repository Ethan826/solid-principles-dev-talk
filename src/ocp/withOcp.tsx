import React from "react";
import { render } from "react-dom";

interface AthleteHeadlineProps {
  readonly bio: string;
  readonly firstName: string;
  readonly lastName: string;
}

const AthleteHeadline = ({
  firstName,
  lastName,
  bio,
}: AthleteHeadlineProps) => (
  <>
    <h1>
      Athlete Stats for {firstName} {lastName}
    </h1>
    <p>{bio}</p>
  </>
);

interface TeamAndYearsActiveProps {
  readonly team: string;
  readonly yearsActive: [number, number];
}

const TeamAndYearsActive = ({ team, yearsActive }: TeamAndYearsActiveProps) => (
  <>
    <dt>Team</dt>
    <dd>{team}</dd>
    <dt>Years Active</dt>
    <dd>
      {yearsActive[0]}–{yearsActive[1]}
    </dd>
  </>
);

interface CyclistProps extends AthleteHeadlineProps, TeamAndYearsActiveProps {
  readonly grandTourWins: ReadonlyArray<string>;
  readonly monumentWins: ReadonlyArray<string>;
}

const Cyclist = ({
  grandTourWins,
  monumentWins,
  team,
  yearsActive,
  bio,
  firstName,
  lastName,
}: CyclistProps) => (
  <>
    <AthleteHeadline bio={bio} firstName={firstName} lastName={lastName} />
    <dl>
      <TeamAndYearsActive team={team} yearsActive={yearsActive} />
      <dt>Grand Tour Wins</dt>
      <dd>
        <ul>
          {grandTourWins.map((win) => (
            <li>{win}</li>
          ))}
        </ul>
      </dd>
      <dt>Monument Wins</dt>
      <dd>
        <ul>
          {monumentWins.map((win) => (
            <li>{win}</li>
          ))}
        </ul>
      </dd>
    </dl>
  </>
);

interface BaseballPlayerProps
  extends AthleteHeadlineProps,
    TeamAndYearsActiveProps {
  readonly battingAverage: number;
  readonly war: number;
}

const BaseballPlayer = ({
  team,
  yearsActive,
  bio,
  firstName,
  lastName,
  battingAverage,
  war,
}: BaseballPlayerProps) => (
  <>
    <AthleteHeadline bio={bio} firstName={firstName} lastName={lastName} />
    <dl>
      <TeamAndYearsActive team={team} yearsActive={yearsActive} />
      <dt>Batting Average</dt>
      <dd>{battingAverage}</dd>
      <dt>Wins Above Replacement</dt>
      <dd>{war}</dd>
    </dl>
  </>
);

export type Athlete = typeof Cyclist | typeof BaseballPlayer;

const Ryno = () => (
  <BaseballPlayer
    bio={`Ryne Sandberg (1959–), “Ryno” to fans, was a 10-time All Star, 1984
    MVP, Gold Glove at Second Base every year from 1983-91, and 7-time Silver
    Slugger.`}
    firstName="Ryne"
    lastName="Sandberg"
    team="Chicago Cubs"
    yearsActive={[1981, 1997]}
    battingAverage={0.285}
    war={68.0}
  />
);

const Bartali = () => (
  <Cyclist
    bio={`Gino Bartali (1914–2000) is the only cyclist to have won Grand Tours
    before and after WWII. In WWII he concealed a Jewish family in his basement.
    He carried documents for the Italian Resistance in the tubes of his bicycle,
    using his notoriety to avoid Italian police and German troops. He was
    recognized as a “Righteous Among the Nations” by Yad Vashem in 2013, 13
    years after his death.`}
    firstName="Gino"
    lastName="Bartali"
    team="Legnano"
    yearsActive={[1935, 1954]}
    grandTourWins={[
      "1938 Tour de France",
      "1948 Tour de France",
      "Giro d'Italia 1936",
      "Giro d'Italia 1937",
      "Giro d'Italia 1946",
    ]}
    monumentWins={[
      "Giro di Lombardia 1936",
      "Giro di Lombardia 1939",
      "Giro di Lombardia 1940",
      "Milan–San Remo 1939",
      "Milan–San Remo 1940",
      "Milan–San Remo 1947",
      "Milan–San Remo 1950",
    ]}
  />
);

const SomeAthletes = (
  <>
    <Bartali />
    <Ryno />
  </>
);

render(SomeAthletes, document.getElementById("root"));

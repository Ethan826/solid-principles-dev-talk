import type { PropsWithChildren } from "react";
import React from "react";
import { createRoot } from "react-dom/client";

// =============================================================================
// Athlete
// =============================================================================

interface AthleteDataProps {
  readonly team: string;
  readonly yearsActive: [number, number];
}

const AthleteData = ({
  team,
  yearsActive,
  children,
}: PropsWithChildren<AthleteDataProps>) => (
  <dl>
    <dt>Team</dt>
    <dd>{team}</dd>
    <dt>Years Active</dt>
    <dd>
      {yearsActive[0]}–{yearsActive[1]}
    </dd>
    {children}
  </dl>
);

interface AthleteHeaderProps {
  readonly bio: string;
  readonly firstName: string;
  readonly lastName: string;
}

const AthleteHeader = ({ firstName, lastName, bio }: AthleteHeaderProps) => (
  <>
    <h1>
      Athlete Stats for {firstName} {lastName}
    </h1>
    <p>{bio}</p>
  </>
);

interface AthleteProps extends AthleteHeaderProps, AthleteDataProps {}

const Athlete = ({
  bio,
  firstName,
  lastName,
  team,
  yearsActive,
  children,
}: PropsWithChildren<AthleteProps>) => (
  <>
    <AthleteHeader bio={bio} firstName={firstName} lastName={lastName} />
    <AthleteData team={team} yearsActive={yearsActive}>
      {children}
    </AthleteData>
  </>
);

// =============================================================================
// Baseball Player
// =============================================================================

interface BaseballStatsProps {
  readonly battingAverage: number;
  readonly war: number;
}

const BaseballStats = ({ battingAverage, war }: BaseballStatsProps) => (
  <>
    <dt>Batting Average</dt>
    <dd>{battingAverage}</dd>
    <dt>Wins Above Replacement</dt>
    <dd>{war}</dd>
  </>
);

interface BaseballPlayerProps extends BaseballStatsProps, AthleteProps {}

const BaseballPlayer = ({
  battingAverage,
  war,
  ...rest
}: BaseballPlayerProps) => (
  <Athlete {...rest}>
    <BaseballStats battingAverage={battingAverage} war={war} />
  </Athlete>
);

// =============================================================================
// Cyclist
// =============================================================================

interface CyclistStatsProps {
  readonly grandTourWins: ReadonlyArray<string>;
  readonly monumentWins: ReadonlyArray<string>;
}

const CyclistStats = ({ monumentWins, grandTourWins }: CyclistStatsProps) => (
  <>
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
  </>
);

interface CyclistProps extends CyclistStatsProps, AthleteProps {}

const Cyclist = ({ grandTourWins, monumentWins, ...rest }: CyclistProps) => (
  <Athlete {...rest}>
    <CyclistStats grandTourWins={grandTourWins} monumentWins={monumentWins} />
  </Athlete>
);

// =============================================================================
// Instances
// =============================================================================

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

// =============================================================================
// Render
// =============================================================================

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const domNode = document.getElementById("root")!;

createRoot(domNode).render(SomeAthletes);

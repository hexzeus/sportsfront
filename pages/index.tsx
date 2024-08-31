import React, { useEffect, useState, useCallback } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../components/layout';
import Image from 'next/image';
import Link from 'next/link';
import { AlertCircle, Clock, Calendar, Trophy, Radio, ArrowRight } from 'lucide-react';

// List of NFL Teams
const NFL_TEAMS = [
    { name: "Arizona Cardinals", abbreviation: "ARI" },
    { name: "Atlanta Falcons", abbreviation: "ATL" },
    { name: "Baltimore Ravens", abbreviation: "BAL" },
    { name: "Buffalo Bills", abbreviation: "BUF" },
    { name: "Carolina Panthers", abbreviation: "CAR" },
    { name: "Chicago Bears", abbreviation: "CHI" },
    { name: "Cincinnati Bengals", abbreviation: "CIN" },
    { name: "Cleveland Browns", abbreviation: "CLE" },
    { name: "Dallas Cowboys", abbreviation: "DAL" },
    { name: "Denver Broncos", abbreviation: "DEN" },
    { name: "Detroit Lions", abbreviation: "DET" },
    { name: "Green Bay Packers", abbreviation: "GB" },
    { name: "Houston Texans", abbreviation: "HOU" },
    { name: "Indianapolis Colts", abbreviation: "IND" },
    { name: "Jacksonville Jaguars", abbreviation: "JAX" },
    { name: "Kansas City Chiefs", abbreviation: "KC" },
    { name: "Las Vegas Raiders", abbreviation: "LV" },
    { name: "Los Angeles Chargers", abbreviation: "LAC" },
    { name: "Los Angeles Rams", abbreviation: "LA" },
    { name: "Miami Dolphins", abbreviation: "MIA" },
    { name: "Minnesota Vikings", abbreviation: "MIN" },
    { name: "New England Patriots", abbreviation: "NE" },
    { name: "New Orleans Saints", abbreviation: "NO" },
    { name: "New York Giants", abbreviation: "NYG" },
    { name: "New York Jets", abbreviation: "NYJ" },
    { name: "Philadelphia Eagles", abbreviation: "PHI" },
    { name: "Pittsburgh Steelers", abbreviation: "PIT" },
    { name: "San Francisco 49ers", abbreviation: "SF" },
    { name: "Seattle Seahawks", abbreviation: "SEA" },
    { name: "Tampa Bay Buccaneers", abbreviation: "TB" },
    { name: "Tennessee Titans", abbreviation: "TEN" },
    { name: "Washington Commanders", abbreviation: "WAS" },
];

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const hasVisitedIntro = req.cookies.visitedIntro;

    if (!hasVisitedIntro) {
        return {
            redirect: {
                destination: '/intro',
                permanent: false,
            },
        };
    }

    return { props: {} };
};

const HomePage: React.FC = () => {
    const [animated, setAnimated] = useState(false);
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);
    const [quarter, setQuarter] = useState(1);
    const [timeLeft, setTimeLeft] = useState("15:00");
    const [gameStatus, setGameStatus] = useState("Not Started");
    const [winner, setWinner] = useState<string | null>(null);
    const [commentary, setCommentary] = useState<string[]>([]);
    const [down, setDown] = useState(1);
    const [yardsToGo, setYardsToGo] = useState(10);
    const [fieldPosition, setFieldPosition] = useState(20);

    // Select two distinct random teams
    const [homeTeam, setHomeTeam] = useState<{ name: string; abbreviation: string }>({ name: "", abbreviation: "" });
    const [awayTeam, setAwayTeam] = useState<{ name: string; abbreviation: string }>({ name: "", abbreviation: "" });

    const [possession, setPossession] = useState<string>("");

    // Initialize teams on component mount
    useEffect(() => {
        const selectRandomTeams = () => {
            let home = NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)];
            let away = NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)];

            // Ensure home and away teams are not the same
            while (away.abbreviation === home.abbreviation) {
                away = NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)];
            }

            setHomeTeam(home);
            setAwayTeam(away);

            // Randomly decide which team starts with possession
            setPossession(Math.random() < 0.5 ? home.abbreviation : away.abbreviation);
        };

        selectRandomTeams();
    }, []);

    const addCommentary = useCallback((message: string) => {
        setCommentary(prev => [message, ...prev.slice(0, 4)]);
    }, []);

    const generatePlay = useCallback(() => {
        if (!homeTeam.abbreviation || !awayTeam.abbreviation) return;

        const playTypes = ['run', 'pass', 'sack', 'turnover', 'special'];
        const playType = playTypes[Math.floor(Math.random() * playTypes.length)];
        let yards = 0;
        let commentary = '';

        const currentTeam = possession === homeTeam.abbreviation ? homeTeam.abbreviation : awayTeam.abbreviation;
        const opponentTeam = possession === homeTeam.abbreviation ? awayTeam.abbreviation : homeTeam.abbreviation;

        switch (playType) {
            case 'run':
                yards = Math.floor(Math.random() * 10) - 2;
                commentary = `${currentTeam} ${yards > 0 ? 'gains' : 'loses'} ${Math.abs(yards)} yards on a ${yards > 5 ? 'powerful' : 'quick'} run.`;
                break;
            case 'pass':
                yards = Math.floor(Math.random() * 20) - 5;
                commentary = yards > 0
                    ? `${currentTeam} completes a ${yards > 10 ? 'deep' : 'short'} pass for ${yards} yards.`
                    : `${currentTeam}'s pass falls incomplete.`;
                break;
            case 'sack':
                yards = -Math.floor(Math.random() * 10) - 1;
                commentary = `${opponentTeam} sacks the quarterback for a loss of ${Math.abs(yards)} yards!`;
                break;
            case 'turnover':
                commentary = `Turnover! ${opponentTeam} takes possession of the ball.`;
                setPossession(prev => prev === homeTeam.abbreviation ? awayTeam.abbreviation : homeTeam.abbreviation);
                setDown(1);
                setYardsToGo(10);
                setFieldPosition(100 - fieldPosition);
                break;
            case 'special':
                if (Math.random() < 0.5) {
                    yards = Math.floor(Math.random() * 40) + 10;
                    commentary = `It's a trick play! ${currentTeam} surprises the defense and gains a big ${yards} yards!`;
                } else {
                    yards = -Math.floor(Math.random() * 15) - 5;
                    commentary = `${currentTeam} attempts a desperate play but it backfires, losing ${Math.abs(yards)} yards!`;
                }
                break;
        }

        if (playType !== 'turnover') {
            setFieldPosition(prev => Math.min(Math.max(prev + yards, 0), 100));
            setYardsToGo(prev => Math.max(prev - yards, 0));
            setDown(prev => prev + 1);

            if (yardsToGo <= yards) {
                setDown(1);
                setYardsToGo(10);
                addCommentary(`${currentTeam} gets a first down!`);
            } else if (down === 4) {
                if (fieldPosition > 65) {
                    const fieldGoalSuccess = Math.random() < 0.8;
                    if (fieldGoalSuccess) {
                        addCommentary(`${currentTeam} kicks a field goal and scores 3 points!`);
                        currentTeam === homeTeam.abbreviation ? setHomeScore(prev => prev + 3) : setAwayScore(prev => prev + 3);
                    } else {
                        addCommentary(`${currentTeam}'s field goal attempt is no good.`);
                    }
                } else {
                    addCommentary(`${currentTeam} punts the ball.`);
                }
                setPossession(prev => prev === homeTeam.abbreviation ? awayTeam.abbreviation : homeTeam.abbreviation);
                setDown(1);
                setYardsToGo(10);
                setFieldPosition(100 - fieldPosition);
            }
        }

        if (fieldPosition >= 100) {
            addCommentary(`Touchdown ${currentTeam}!`);
            currentTeam === homeTeam.abbreviation ? setHomeScore(prev => prev + 7) : setAwayScore(prev => prev + 7);
            setPossession(prev => prev === homeTeam.abbreviation ? awayTeam.abbreviation : homeTeam.abbreviation);
            setDown(1);
            setYardsToGo(10);
            setFieldPosition(20);
        }

        addCommentary(commentary);
    }, [
        possession,
        down,
        yardsToGo,
        fieldPosition,
        addCommentary,
        homeTeam,
        awayTeam
    ]);

    const determineWinner = useCallback(() => {
        if (homeScore > awayScore) {
            setWinner(homeTeam.abbreviation);
            addCommentary(`${homeTeam.name} win the game in dramatic fashion!`);
        } else if (awayScore > homeScore) {
            setWinner(awayTeam.abbreviation);
            addCommentary(`${awayTeam.name} pull off a stunning victory!`);
        } else {
            setWinner("TIE");
            addCommentary("The game ends in a heart-stopping tie!");
        }
    }, [homeScore, awayScore, addCommentary, homeTeam, awayTeam]);

    useEffect(() => {
        setAnimated(true);
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (gameStatus === "Not Started" && homeTeam.abbreviation && awayTeam.abbreviation) {
            setGameStatus("In Progress");
            addCommentary("The game is underway!");
        }

        if (gameStatus !== "In Progress") return;

        const gameTimer = setInterval(() => {
            setTimeLeft(prev => {
                const [minutes, seconds] = prev.split(':').map(Number);
                if (minutes === 0 && seconds === 0) {
                    if (quarter < 4) {
                        setQuarter(prev => prev + 1);
                        addCommentary(`End of Quarter ${quarter}. The teams switch sides.`);
                        return "15:00";
                    } else {
                        clearInterval(gameTimer);
                        setGameStatus("Finished");
                        determineWinner();
                        return "00:00";
                    }
                }
                const totalSeconds = minutes * 60 + seconds - 15;
                const newMinutes = Math.floor(totalSeconds / 60);
                const newSeconds = totalSeconds % 60;
                return `${String(Math.max(0, newMinutes)).padStart(2, '0')}:${String(Math.max(0, newSeconds)).padStart(2, '0')}`;
            });

            generatePlay();

        }, 3000);  // Update every 3 seconds for a manageable pace

        return () => clearInterval(gameTimer);
    }, [gameStatus, quarter, generatePlay, addCommentary, determineWinner, homeTeam, awayTeam]);

    const formattedDate = currentTime?.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const formattedTime = currentTime?.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    return (
        <Layout>
            <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white transition-all duration-1000 opacity-100">
                <main className="flex-grow flex flex-col items-center justify-center text-center space-y-8 px-4 sm:px-6 md:px-8 py-8">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-gray-300 to-blue-500 uppercase leading-tight drop-shadow-lg animate-pulse">
                        Lock and Hammer Picks
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl text-gray-300 tracking-wide leading-relaxed max-w-screen-sm md:max-w-screen-md animate-fadeIn">
                        Dominate Every Play. Crush Every Bet. Forge Your Victory.
                    </p>
                    <Link
                        href="/bets"
                        className="group relative inline-flex items-center justify-center px-8 py-4 sm:px-12 sm:py-6 overflow-hidden text-lg sm:text-2xl font-bold text-white uppercase tracking-wide transition-all duration-300 ease-out bg-gradient-to-r from-blue-700 via-black to-gray-900 rounded-full shadow-lg hover:from-blue-800 hover:to-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50"
                    >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
                        <span className="absolute inset-0 w-full h-full bg-blue-800 bg-opacity-20 blur-lg rounded-full"></span>
                        <span className="relative z-10 flex items-center space-x-3">
                            <span className="text-xl sm:text-2xl">🏈</span>
                            <span className="font-bold tracking-widest">Analyze Our Picks</span>
                            <ArrowRight className="w-6 h-6 ml-2 transform group-hover:translate-x-1 transition-transform duration-300 ease-out" />
                        </span>
                    </Link>


                    <div className={`w-full max-w-4xl bg-black bg-opacity-80 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl transform transition-all duration-1000 ${animated ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                        <div className="flex flex-col items-center space-y-6">
                            <div className="flex justify-between items-center w-full">
                                <div className="text-center">
                                    <div className="text-base sm:text-lg md:text-xl font-bold text-blue-500 animate-pulse">
                                        <Clock className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                                        {formattedTime}
                                    </div>
                                    <div className="text-sm sm:text-base md:text-lg font-medium text-gray-400">
                                        <Calendar className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                                        {formattedDate}
                                    </div>
                                </div>
                                <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
                                    <Image
                                        src="/file.png"
                                        alt="Lock and Hammer Picks Logo"
                                        fill
                                        sizes="(max-width: 768px) 64px, (max-width: 1024px) 80px, 96px"
                                        style={{ objectFit: 'contain' }}
                                        priority
                                        className="drop-shadow-xl animate-pulse"
                                    />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-gray-800 to-gray-900 w-full p-4 rounded-xl shadow-lg border border-blue-800">
                                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-2xl sm:text-3xl md:text-4xl font-bold">
                                    <div className="text-blue-500 animate-pulse">{homeTeam.abbreviation || "HOME"}</div>
                                    <div className="text-white">{timeLeft}</div>
                                    <div className="text-gray-300 animate-pulse">{awayTeam.abbreviation || "AWAY"}</div>
                                    <div className="text-blue-500">{homeScore}</div>
                                    <div className="text-yellow-500 text-xl sm:text-2xl md:text-3xl">Q{quarter}</div>
                                    <div className="text-gray-300">{awayScore}</div>
                                </div>
                                <div className="mt-2 sm:mt-4 text-base sm:text-lg md:text-xl font-semibold text-gray-300">
                                    {gameStatus === "In Progress" ? `${possession} ball • ${down}${['st', 'nd', 'rd'][down - 1] || 'th'} & ${yardsToGo}` : gameStatus}
                                </div>
                                {winner && (
                                    <div className="mt-4 text-xl sm:text-2xl md:text-3xl font-bold flex items-center justify-center animate-bounce">
                                        <Trophy className="w-6 h-6 sm:w-8 sm:h-8 mr-2 text-yellow-500" />
                                        {winner === "TIE" ? "It's a Tie!" : `${winner === homeTeam.abbreviation ? homeTeam.name : awayTeam.name} Triumphs!`}
                                    </div>
                                )}
                            </div>

                            <div className="bg-gradient-to-r from-gray-900 to-blue-900 w-full p-4 rounded-xl shadow-lg border border-blue-800">
                                <div className="flex items-center justify-center mb-2 animate-pulse">
                                    <Radio className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-500" />
                                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-300">Live Commentary</span>
                                </div>
                                <div className="space-y-2 h-32 sm:h-40 md:h-48 overflow-y-auto text-sm sm:text-base md:text-lg">
                                    {commentary.map((comment, index) => (
                                        <p key={index} className="animate-fadeIn">{comment}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="w-full text-center py-4 sm:py-6 bg-black bg-opacity-70">
                    <Link href="/disclaimer" className="flex items-center justify-center text-sm sm:text-base text-gray-400 hover:text-blue-400 transition duration-300 animate-pulse">
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Betting Disclaimer
                    </Link>
                </footer>

                <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-blue-900 to-gray-800 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-gradient-to-r from-gray-800 to-blue-900 rounded-full blur-3xl opacity-20 animate-spin-slow"></div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;

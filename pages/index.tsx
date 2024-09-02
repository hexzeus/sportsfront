import React, { useEffect, useState, useCallback } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../components/layout';
import Image from 'next/image';
import Link from 'next/link';
import { AlertCircle, Clock, Calendar, Trophy, Radio, ArrowRight, Skull, Flame, Zap } from 'lucide-react';

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
            <div className="min-h-screen flex flex-col justify-between bg-zinc-900 text-zinc-100 transition-all duration-1000 opacity-100 overflow-hidden">
                {/* Badass Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-800"></div>
                    <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                        <filter id="noise">
                            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                            <feColorMatrix type="saturate" values="0" />
                        </filter>
                        <rect width="100%" height="100%" filter="url(#noise)" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 via-transparent to-orange-700/20"></div>
                    <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 px-4 sm:px-6 md:px-8 py-8 sm:py-12">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 uppercase tracking-tighter drop-shadow-glow" style={{ fontFamily: 'Impact, sans-serif' }}>
                        Lock & Hammer Picks
                        <span className="block h-1 w-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 mt-2"></span>
                    </h1>

                    <p className="text-lg sm:text-xl md:text-2xl text-zinc-300 font-bold tracking-wide leading-tight max-w-screen-sm md:max-w-screen-md" style={{ fontFamily: 'Arial Black, sans-serif' }}>
                        <span className="text-red-500">DOMINATE.</span> <span className="text-orange-500">CRUSH.</span> <span className="text-yellow-500">CONQUER.</span>
                    </p>

                    <div className="flex justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                        {[Skull, Flame, Zap].map((Icon, index) => (
                            <Icon
                                key={index}
                                className="w-10 h-10 sm:w-12 sm:h-12 text-zinc-300 animate-pulse"
                                style={{ animationDelay: `${index * 150}ms` }}
                            />
                        ))}
                    </div>

                    <Link
                        href="/bets"
                        className="group relative inline-flex items-center justify-center w-full sm:w-auto px-4 py-3 sm:px-6 sm:py-4 overflow-hidden text-sm sm:text-base font-extrabold text-white uppercase tracking-wide sm:tracking-widest transition-all duration-300 ease-out bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 active:scale-95 transform hover:scale-102 hover:-translate-y-0.5"
                    >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
                        <span className="absolute inset-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8cGF0aCBkPSJNMCA1TDUgMFpNNiA0TDQgNlpNLTEgMUwxIC0xWiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-10"></span>
                        <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white to-transparent opacity-10 transform scale-150 group-hover:scale-100 transition-transform duration-300 ease-out"></span>
                        <span className="relative z-10 flex items-center space-x-1 sm:space-x-2">
                            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 animate-bounce" />
                            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 animate-pulse" />
                            <span className="font-black text-shadow">Unleash Our Picks</span>
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 transform group-hover:translate-x-1 transition-transform duration-300 ease-out" />
                        </span>
                        <span className="absolute inset-0 w-full h-full border-2 border-white opacity-0 group-hover:opacity-10 rounded-full scale-105 group-hover:scale-100 transition-all duration-300 ease-out"></span>
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 blur-sm transform -skew-x-12 group-hover:skew-x-12 transition-all duration-500 ease-out"></span>
                    </Link>

                    <div className="w-full max-w-2xl sm:max-w-3xl bg-zinc-900 bg-opacity-80 rounded-2xl p-4 sm:p-6 shadow-2xl border border-zinc-700">
                        <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                            <div className="flex justify-between items-center w-full">
                                <div className="text-center">
                                    <div className="text-sm sm:text-base md:text-lg font-bold text-orange-500 animate-pulse">
                                        <Clock className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                                        {formattedTime}
                                    </div>
                                    <div className="text-xs sm:text-sm md:text-base font-medium text-zinc-400">
                                        <Calendar className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                                        {formattedDate}
                                    </div>
                                </div>
                                <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20">
                                    <Image
                                        src="/file.png"
                                        alt="Lock and Hammer Picks Logo"
                                        fill
                                        sizes="(max-width: 768px) 48px, (max-width: 1024px) 64px, 80px"
                                        style={{ objectFit: 'contain' }}
                                        priority
                                        className="drop-shadow-xl animate-pulse"
                                    />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 w-full p-3 sm:p-4 rounded-xl shadow-lg border border-zinc-700">
                                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-lg sm:text-2xl md:text-3xl font-bold">
                                    <div className="text-red-500 animate-pulse">{homeTeam.abbreviation || "HOME"}</div>
                                    <div className="text-zinc-100">{timeLeft}</div>
                                    <div className="text-orange-500 animate-pulse">{awayTeam.abbreviation || "AWAY"}</div>
                                    <div className="text-red-500">{homeScore}</div>
                                    <div className="text-yellow-500 text-base sm:text-xl md:text-2xl">Q{quarter}</div>
                                    <div className="text-orange-500">{awayScore}</div>
                                </div>
                                <div className="mt-2 sm:mt-4 text-xs sm:text-sm md:text-base font-semibold text-zinc-300">
                                    {gameStatus === "In Progress" ? `${possession} ball • ${down}${['st', 'nd', 'rd'][down - 1] || 'th'} & ${yardsToGo}` : gameStatus}
                                </div>
                                {winner && (
                                    <div className="mt-4 text-lg sm:text-xl md:text-2xl font-bold flex items-center justify-center animate-bounce">
                                        <Trophy className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-yellow-500" />
                                        {winner === "TIE" ? "It's a Tie!" : `${winner === homeTeam.abbreviation ? homeTeam.name : awayTeam.name} Triumphs!`}
                                    </div>
                                )}
                            </div>

                            <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 w-full p-3 sm:p-4 rounded-xl shadow-lg border border-zinc-700">
                                <div className="flex items-center justify-center mb-2 animate-pulse">
                                    <Radio className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-500" />
                                    <span className="text-md sm:text-lg md:text-xl font-bold text-zinc-300">Live Commentary</span>
                                </div>
                                <div className="space-y-2 h-24 sm:h-32 md:h-40 overflow-y-auto text-xs sm:text-sm md:text-base">
                                    {commentary.map((comment, index) => (
                                        <p key={index} className="animate-fadeIn">{comment}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="relative z-10 w-full text-center py-3 sm:py-4 bg-zinc-900 bg-opacity-70">
                    <Link href="/disclaimer" className="flex items-center justify-center text-xs sm:text-sm text-zinc-400 hover:text-orange-400 transition duration-300 animate-pulse">
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Betting Disclaimer
                    </Link>
                </footer>
            </div>
        </Layout>
    );
};

export default HomePage;

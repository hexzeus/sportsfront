import React, { useEffect, useState, useCallback } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../components/layout';
import Image from 'next/image';
import Link from 'next/link';
import { AlertCircle, Clock, Calendar, Trophy, Radio } from 'lucide-react';

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
    const [possession, setPossession] = useState(Math.random() < 0.5 ? "ATL" : "OPP");
    const [winner, setWinner] = useState<string | null>(null);
    const [commentary, setCommentary] = useState<string[]>([]);
    const [down, setDown] = useState(1);
    const [yardsToGo, setYardsToGo] = useState(10);
    const [fieldPosition, setFieldPosition] = useState(20);

    const addCommentary = useCallback((message: string) => {
        setCommentary(prev => [message, ...prev.slice(0, 4)]);
    }, []);

    const generatePlay = useCallback(() => {
        const playTypes = ['run', 'pass', 'sack', 'turnover', 'special'];
        const playType = playTypes[Math.floor(Math.random() * playTypes.length)];
        let yards = 0;
        let commentary = '';

        switch (playType) {
            case 'run':
                yards = Math.floor(Math.random() * 10) - 2;
                commentary = `${possession} ${yards > 0 ? 'gains' : 'loses'} ${Math.abs(yards)} yards on a ${yards > 5 ? 'powerful' : 'quick'} run.`;
                break;
            case 'pass':
                yards = Math.floor(Math.random() * 20) - 5;
                commentary = yards > 0
                    ? `${possession} completes a ${yards > 10 ? 'deep' : 'short'} pass for ${yards} yards.`
                    : `${possession}&apos;s pass falls incomplete.`;
                break;
            case 'sack':
                yards = -Math.floor(Math.random() * 10) - 1;
                commentary = `${possession === 'ATL' ? 'OPP' : 'ATL'} sacks the quarterback for a loss of ${Math.abs(yards)} yards!`;
                break;
            case 'turnover':
                commentary = `Turnover! ${possession === 'ATL' ? 'OPP' : 'ATL'} takes possession of the ball.`;
                setPossession(prev => prev === 'ATL' ? 'OPP' : 'ATL');
                setDown(1);
                setYardsToGo(10);
                setFieldPosition(100 - fieldPosition);
                break;
            case 'special':
                if (Math.random() < 0.5) {
                    yards = Math.floor(Math.random() * 40) + 10;
                    commentary = `It&apos;s a trick play! ${possession} surprises the defense and gains a big ${yards} yards!`;
                } else {
                    yards = -Math.floor(Math.random() * 15) - 5;
                    commentary = `${possession} attempts a desperate play but it backfires, losing ${Math.abs(yards)} yards!`;
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
                addCommentary(`${possession} gets a first down!`);
            } else if (down === 4) {
                if (fieldPosition > 65) {
                    const fieldGoalSuccess = Math.random() < 0.8;
                    if (fieldGoalSuccess) {
                        addCommentary(`${possession} kicks a field goal and scores 3 points!`);
                        possession === 'ATL' ? setHomeScore(prev => prev + 3) : setAwayScore(prev => prev + 3);
                    } else {
                        addCommentary(`${possession}&apos;s field goal attempt is no good.`);
                    }
                } else {
                    addCommentary(`${possession} punts the ball.`);
                }
                setPossession(prev => prev === 'ATL' ? 'OPP' : 'ATL');
                setDown(1);
                setYardsToGo(10);
                setFieldPosition(100 - fieldPosition);
            }
        }

        if (fieldPosition >= 100) {
            addCommentary(`Touchdown ${possession}!`);
            possession === 'ATL' ? setHomeScore(prev => prev + 7) : setAwayScore(prev => prev + 7);
            setPossession(prev => prev === 'ATL' ? 'OPP' : 'ATL');
            setDown(1);
            setYardsToGo(10);
            setFieldPosition(20);
        }

        addCommentary(commentary);
    }, [possession, down, yardsToGo, fieldPosition, addCommentary]);

    const determineWinner = useCallback(() => {
        if (homeScore > awayScore) {
            setWinner("ATL");
            addCommentary("The Atlanta Falcons win the game in dramatic fashion!");
        } else if (awayScore > homeScore) {
            setWinner("OPP");
            addCommentary("The opposing team pulls off a stunning victory!");
        } else {
            setWinner("TIE");
            addCommentary("The game ends in a heart-stopping tie!");
        }
    }, [homeScore, awayScore, addCommentary]);

    useEffect(() => {
        setAnimated(true);
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (gameStatus === "Not Started") {
            setGameStatus("In Progress");
            addCommentary("The game is underway!");
        }

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
                const newSeconds = seconds - 15;
                const newMinutes = newSeconds < 0 ? minutes - 1 : minutes;
                return `${String(Math.max(0, newMinutes)).padStart(2, '0')}:${String(Math.max(0, newSeconds + 60) % 60).padStart(2, '0')}`;
            });

            generatePlay();

        }, 3000);  // Update every 3 seconds for a more manageable pace

        return () => clearInterval(gameTimer);
    }, [gameStatus, quarter, generatePlay, addCommentary, determineWinner]);

    const formattedDate = currentTime?.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const formattedTime = currentTime?.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    return (
        <Layout>
            <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-black via-falcons-black to-falcons-red text-white transition-all duration-1000 opacity-100">
                <main className="flex-grow flex flex-col items-center justify-center text-center space-y-10 px-6 sm:px-8 md:px-12">
                    <div className={`w-full max-w-4xl bg-opacity-80 bg-black rounded-3xl p-6 sm:p-8 md:p-16 shadow-2xl transform transition-transform duration-1000 ${animated ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                        <div className="flex flex-col items-center space-y-6">
                            <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-4">
                                <Image
                                    src="/falcon-logo.png"
                                    alt="Atlanta Falcons Logo"
                                    width={128}
                                    height={128}
                                    priority
                                    className="drop-shadow-xl animate-pulse"
                                />
                            </div>

                            <div className="bg-gray-900 w-full p-4 rounded-lg shadow-lg">
                                <div className="grid grid-cols-3 gap-4 text-4xl md:text-6xl font-bold">
                                    <div className="text-falcons-red animate-glow">ATL</div>
                                    <div className="text-white">{timeLeft}</div>
                                    <div className="text-falcons-silver animate-glow">OPP</div>
                                    <div className="text-falcons-red">{homeScore}</div>
                                    <div className="text-yellow-400">Q{quarter}</div>
                                    <div className="text-falcons-silver">{awayScore}</div>
                                </div>
                                <div className="mt-4 text-2xl font-semibold">
                                    {gameStatus === "In Progress" ? `${possession} ball • ${down}${['st', 'nd', 'rd'][down - 1] || 'th'} & ${yardsToGo}` : gameStatus}
                                </div>
                                {winner && (
                                    <div className="mt-4 text-3xl font-bold flex items-center justify-center animate-fadeIn">
                                        <Trophy className="w-8 h-8 mr-2 text-yellow-400" />
                                        {winner === "TIE" ? "It&apos;s a Tie!" : `${winner} Wins!`}
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-800 w-full p-4 rounded-lg shadow-lg">
                                <div className="flex items-center justify-center mb-2 animate-fadeIn">
                                    <Radio className="w-6 h-6 mr-2 text-falcons-red animate-pulse" />
                                    <span className="text-xl font-bold">Live Commentary</span>
                                </div>
                                <div className="space-y-2 h-48 overflow-y-auto">
                                    {commentary.map((comment, index) => (
                                        <p key={index} className="text-sm md:text-base animate-glow">{comment}</p>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between w-full text-lg md:text-xl">
                                <div className="flex items-center">
                                    <Calendar className="w-6 h-6 mr-2 animate-glow" />
                                    {formattedDate}
                                </div>
                                <div className="flex items-center">
                                    <Clock className="w-6 h-6 mr-2 animate-glow" />
                                    {formattedTime}
                                </div>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-wider text-falcons-red uppercase leading-tight drop-shadow-lg animate-fadeIn">
                        Falcons Rise Up
                    </h1>
                    <p className="text-lg sm:text-xl md:text-3xl text-gray-300 tracking-wide leading-relaxed max-w-screen-sm md:max-w-screen-md animate-fadeIn">
                        Every Play. Every Bet. Every Victory. Let&apos;s turn passion into power on the field.
                    </p>

                    <Link href="/bets" className="inline-block bg-falcons-red text-white text-lg sm:text-xl md:text-2xl font-semibold py-3 sm:py-4 px-8 sm:px-10 rounded-full shadow-xl hover:bg-black hover:text-falcons-silver transition duration-300 transform hover:scale-105 hover:shadow-2xl animate-glow">
                        Join the Action
                    </Link>
                </main>

                <footer className="w-full text-center py-10 sm:py-12 bg-black bg-opacity-50">
                    <Link href="/disclaimer" className="flex items-center justify-center text-sm sm:text-base text-gray-400 hover:text-gray-200 transition duration-300 animate-glow">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Disclaimer
                    </Link>
                </footer>

                <div className="absolute inset-0 z-[-1] overflow-hidden">
                    <div className="absolute top-1/3 left-1/4 w-40 h-40 sm:w-48 sm:h-48 md:w-60 md:h-60 bg-gradient-to-r from-falcons-red to-yellow-400 rounded-full blur-3xl opacity-40 animate-pulse"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-44 h-44 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-gradient-to-r from-gray-800 to-black rounded-full blur-3xl opacity-40"></div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
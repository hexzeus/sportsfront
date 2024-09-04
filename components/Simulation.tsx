import React, { useEffect, useState, useCallback } from 'react';
import { Clock, Calendar, Trophy, Radio } from 'lucide-react';
import Image from 'next/image';

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

const Simulation: React.FC = () => {
    const [homeTeam, setHomeTeam] = useState<{ name: string; abbreviation: string }>({ name: "", abbreviation: "" });
    const [awayTeam, setAwayTeam] = useState<{ name: string; abbreviation: string }>({ name: "", abbreviation: "" });
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);
    const [quarter, setQuarter] = useState(1);
    const [timeLeft, setTimeLeft] = useState("15:00");
    const [commentary, setCommentary] = useState<string[]>([]);
    const [down, setDown] = useState(1);
    const [yardsToGo, setYardsToGo] = useState(10);
    const [fieldPosition, setFieldPosition] = useState(20);
    const [possession, setPossession] = useState<string>("");
    const [gameStatus, setGameStatus] = useState("Not Started");
    const [winner, setWinner] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const selectRandomTeams = () => {
            let home = NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)];
            let away = NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)];
            while (away.abbreviation === home.abbreviation) {
                away = NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)];
            }
            setHomeTeam(home);
            setAwayTeam(away);
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
    );
};

export default Simulation;

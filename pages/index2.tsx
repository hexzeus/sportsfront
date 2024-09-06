import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Ensure this import is from next/image
import { AlertCircle, Lock, Trophy, ArrowRight, Hammer, Clock, Calendar } from 'lucide-react';
import axios from 'axios';
import ScoreBoard from '../components/simulation/ScoreBoard';
import Commentary from '../components/simulation/Commentary';
import GameEvents from '../components/simulation/GameEvents';
import Injuries from '../components/simulation/Injuries';
import CoinTossAnimation from '../components/simulation/CoinTossAnimation';
import GameLogic from '../components/simulation/GameLogic';
import SportsAnalysisButton from '../components/SportsAnalysisButton';
import WeatherInfo from 'components/simulation/WeatherInfo';
import CrowdExcitement from 'components/simulation/CrowdExcitement';

const ESPN_NFL_TEAMS_API = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams';

interface Team {
    name: string;
    abbreviation: string;
    color: string;
    logo: string;
    offense: number;
    defense: number;
    specialTeams: number;
}

interface GameState {
    homeScore: number;
    awayScore: number;
    quarter: number;
    timeLeft: string;
    down: number;
    yardsToGo: number;
    fieldPosition: number;
    possession: 'home' | 'away';
    gameStatus: string;
    lastPlay: string;
    driveStatus: string;
    playType: 'normal' | 'kickoff' | 'extraPoint' | 'twoPointConversion';
    timeoutsLeft: { home: number; away: number };
    penalties: { home: number; away: number };
    turnovers: { home: number; away: number };
}

const HomePage: React.FC = () => {
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [teams, setTeams] = useState<Team[]>([]);
    const [homeTeam, setHomeTeam] = useState<Team | null>(null);
    const [awayTeam, setAwayTeam] = useState<Team | null>(null);
    const [gameState, setGameState] = useState<GameState>({
        homeScore: 0,
        awayScore: 0,
        quarter: 1,
        timeLeft: "15:00",
        down: 1,
        yardsToGo: 10,
        fieldPosition: 25,
        possession: 'home',
        gameStatus: "Not Started",
        lastPlay: "",
        driveStatus: "",
        playType: 'kickoff',
        timeoutsLeft: { home: 3, away: 3 },
        penalties: { home: 0, away: 0 },
        turnovers: { home: 0, away: 0 },
    });
    const [commentary, setCommentary] = useState<string[]>([]);
    const [events, setEvents] = useState<string[]>([]);
    const [injuries, setInjuries] = useState<{ home: string[], away: string[] }>({ home: [], away: [] });
    const [showCoinAnimation, setShowCoinAnimation] = useState(false);
    const [weather, setWeather] = useState<string>('Clear');
    const [crowd, setCrowd] = useState<number>(0);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get(ESPN_NFL_TEAMS_API);
                const teamData = response.data.sports[0].leagues[0].teams.map((team: any) => ({
                    name: team.team.displayName,
                    abbreviation: team.team.abbreviation,
                    color: `#${team.team.color}`,
                    logo: team.team.logos[0].href,
                    offense: Math.floor(Math.random() * 20) + 70,
                    defense: Math.floor(Math.random() * 20) + 70,
                    specialTeams: Math.floor(Math.random() * 20) + 70,
                }));
                setTeams(teamData);
            } catch (error) {
                console.error('Error fetching NFL teams:', error);
            }
        };
        fetchTeams();
    }, []);

    useEffect(() => {
        if (teams.length > 0) {
            const selectRandomTeams = () => {
                let home = teams[Math.floor(Math.random() * teams.length)];
                let away = teams[Math.floor(Math.random() * teams.length)];
                while (away.abbreviation === home.abbreviation) {
                    away = teams[Math.floor(Math.random() * teams.length)];
                }
                setHomeTeam(home);
                setAwayTeam(away);
            };
            selectRandomTeams();
        }
    }, [teams]);

    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const updateGameState = useCallback((updater: (prevState: GameState) => GameState) => {
        setGameState(prevState => updater(prevState));
    }, []);

    const addCommentary = useCallback((message: string) => {
        setCommentary(prev => [message, ...prev.slice(0, 4)]);
    }, []);

    const addEvent = useCallback((event: string) => {
        setEvents(prev => [event, ...prev.slice(0, 9)]);
    }, []);

    const updateInjuries = useCallback((team: 'home' | 'away', injury: string) => {
        setInjuries(prev => ({
            ...prev,
            [team]: [...prev[team], injury]
        }));
    }, []);

    return (
        <div className="min-h-screen flex flex-col justify-between bg-black text-white transition-all duration-1000 opacity-100 overflow-hidden relative">
            {/* Bold Sports-Themed Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-dark-blue to-dark-gray h-full"></div>
                <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="sportsGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <rect width="50" height="50" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#sportsGrid)" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-slate-900/30 h-full"></div>
            </div>

            {/* Main Content */}
            <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 px-4 sm:px-6 md:px-8 py-8 sm:py-12">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight">
                    <span className="text-shadow-metallic bg-gradient-to-r from-gray-800 via-gray-600 to-gray-400 bg-clip-text text-transparent animate-gradient-shine">
                        Lock & Hammer Picks
                    </span>
                    <span className="block h-1 w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded-lg shadow-sm mt-3"></span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 font-bold tracking-wide leading-tight">
                    <span className="text-yellow-500">DOMINATE.</span> <span className="text-red-500">CRUSH.</span> <span className="text-gray-300">CONQUER.</span>
                </p>

                <div className="flex justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                    <Lock className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-gray-400 animate-pulse" />
                    <Hammer className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-gray-400 animate-pulse" />
                    <Trophy className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-gray-400 animate-pulse" />
                </div>

                {/* "Unleash Our Picks" Button */}
                <Link
                    href="/bets"
                    className="group relative inline-flex items-center justify-center px-6 py-4 sm:px-8 sm:py-5 lg:px-10 lg:py-6 overflow-hidden text-base sm:text-lg lg:text-xl font-extrabold uppercase tracking-widest transition-all duration-700 ease-out bg-gradient-to-r from-blue-900 via-steel-700 to-gray-500 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 hover:-translate-y-2 border-t-4 border-b-4 border-gray-900"
                >
                    {/* Smoke Effect */}
                    <span className="absolute inset-0 w-full h-full opacity-20 bg-[url('/path-to-smoke-image.png')] bg-cover bg-center pointer-events-none"></span>

                    {/* 3D and Rustic Edge */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-b from-gray-800 via-black to-gray-900 opacity-90 rounded-full pointer-events-none"></span>

                    {/* Smoke Overlay */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent to-black opacity-60 transform group-hover:skew-x-0 transition-all duration-700 ease-in-out pointer-events-none"></span>

                    {/* Dynamic Highlight on Hover */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-t from-yellow-600/20 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-700 ease-in-out pointer-events-none"></span>

                    {/* Logo, Text, and Icons */}
                    <span className="relative z-10 flex items-center space-x-3 sm:space-x-4">
                        <Image
                            src="/file.png" // Your brand logo
                            alt="Brand Logo"
                            width={35}
                            height={35}
                            className="rounded-full border-2 border-gray-400 shadow-lg transform group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Button Text */}
                        <span className="font-black tracking-widest text-shadow-md text-gray-200 group-hover:text-white transition-colors duration-300 ease-out">
                            Unleash Our Picks
                        </span>

                        {/* Trophy and ArrowRight Icons */}
                        <Trophy className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-yellow-500 animate-bounce" />
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 ml-1 transform group-hover:translate-x-2 transition-transform duration-300 ease-out text-gray-300" />
                    </span>
                </Link>


                {/* Game Information */}
                <div className="w-full max-w-4xl space-y-4">
                    <div className="bg-zinc-800 rounded-lg p-2 sm:p-4 flex flex-wrap justify-between items-center text-xs sm:text-sm">
                        <div className="flex items-center mb-1 sm:mb-0 w-1/2 sm:w-auto">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-orange-500" />
                            <span>{currentTime?.toLocaleTimeString()}</span>
                        </div>
                        <div className="flex items-center mb-1 sm:mb-0 w-1/2 sm:w-auto">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gray-400" />
                            <span>{currentTime?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <WeatherInfo weather={weather} />
                        <CrowdExcitement crowdExcitement={crowd} />
                    </div>

                    {/* Scoreboard */}
                    <ScoreBoard gameState={gameState} homeTeam={homeTeam} awayTeam={awayTeam} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-zinc-800 rounded-lg p-2 sm:p-4">
                            <h2 className="text-lg sm:text-xl font-bold mb-2 text-gray-200">Live Commentary</h2>
                            <Commentary commentary={commentary} />
                        </div>

                        <div className="bg-zinc-800 rounded-lg p-2 sm:p-4">
                            <h2 className="text-lg sm:text-xl font-bold mb-2 text-gray-200">Game Events</h2>
                            <GameEvents events={events} />
                        </div>
                    </div>

                    <div className="bg-zinc-800 rounded-lg p-2 sm:p-4">
                        <h2 className="text-lg sm:text-xl font-bold mb-2 text-gray-200">Injuries</h2>
                        <Injuries homeInjuries={injuries.home} awayInjuries={injuries.away} homeTeamName={homeTeam?.name || 'Home'} awayTeamName={awayTeam?.name || 'Away'} />
                    </div>

                    {/* Coin Toss Animation */}
                    <CoinTossAnimation showCoinAnimation={showCoinAnimation} />

                    {/* Game Logic */}
                    <GameLogic
                        gameState={gameState}
                        homeTeam={homeTeam}
                        awayTeam={awayTeam}
                        updateGameState={updateGameState}
                        addCommentary={addCommentary}
                        addEvent={addEvent}
                        updateInjuries={updateInjuries}
                        setWeather={setWeather}
                        setCrowd={setCrowd}
                        setShowCoinAnimation={setShowCoinAnimation}
                    />

                    {/* Sports Analysis Button */}
                    <SportsAnalysisButton />
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 w-full text-center py-3 sm:py-4 bg-black/80 backdrop-blur-md">
                <Link href="/disclaimer" className="flex items-center justify-center text-xs sm:text-sm text-yellow-500 hover:text-blue-400 transition duration-300 animate-pulse">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="text-shadow-lg">Disclaimer</span>
                </Link>
            </footer>
        </div>
    );

};

export default HomePage;

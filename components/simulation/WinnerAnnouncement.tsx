interface WinnerAnnouncementProps {
    winner: string | null;
    homeScore: number;
    awayScore: number;
}

const WinnerAnnouncement: React.FC<WinnerAnnouncementProps> = ({ winner, homeScore, awayScore }) => {
    if (!winner) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-800 text-white p-8 rounded-xl text-center animate-bounce">
                <h1 className="text-4xl font-bold mb-4">Game Over!</h1>
                <p className="text-2xl mb-2">{winner} wins!</p>
                <p className="text-xl">Final Score: {homeScore} - {awayScore}</p>
            </div>
        </div>
    );
};

export default WinnerAnnouncement;

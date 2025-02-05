/**
 * MobiusGame - A progressive difficulty memory and pattern matching game
 *
 * Game Mechanics:
 * - Players must match characters in the sequence with their corresponding directional inputs
 * - Each character's color corresponds to a direction:
 *   - Yellow → Up (w)
 *   - Green → Down (s)
 *   - Blue → Left (a)
 *   - Red → Right (d)
 *
 * Level Progression:
 *
 * Level 1: Basic Pattern Matching
 * - Static colors and character positions
 * - Players learn the basic color-to-direction mapping
 * - Sequence shows colored characters
 * - Directional buttons are color-coded
 *
 * Level 2: Colorless Sequence
 * - Colors remain static
 * - Character positions remain static
 * - Sequence characters appear in gray
 * - Players must match gray sequence characters with colored grid characters
 * - Directional buttons remain color-coded
 *
 * Level 3: Color Rotation
 * - Colors rotate after each correct input
 * - Character positions remain static
 * - Players must adapt to changing color-direction relationships
 * - All visual aids remain available
 *
 * Level 4: Position Shuffle
 * - Colors rotate after each correct input
 * - Characters shuffle positions after each correct input
 * - Players must find characters in new positions while tracking color changes
 * - All visual aids remain available
 *
 * Level 5: Memory Master
 * - Colors rotate after each correct input
 * - Characters shuffle positions after each correct input
 * - Sequence characters appear in gray
 * - Directional buttons lose their colors
 * - Players must rely entirely on memory for color-direction mapping
 *
 * Level 6: Ultimate Memory
 * - Colors rotate after each correct input
 * - Characters shuffle positions after each correct input
 * - Sequence is completely hidden
 * - Directional buttons remain colorless
 * - Players must remember both the sequence and the color-direction mapping
 */

"use client";

import {motion} from "framer-motion";
import {useState, useEffect} from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/ui/dialog";
import {Button} from "@/ui/button";
import {
	ArrowUp,
	ArrowDown,
	ArrowLeft,
	ArrowRight,
	CheckCircle,
	XCircle,
} from "lucide-react";
import {MobiusGameProps} from "@/src/types";

// Add this shuffle function at the top of the component
const rotateArray = <T,>(array: T[]): T[] => {
	const offset = Math.floor(Math.random() * 40) + 1; // Random number between 1-40
	const newArray = [...array];
	// Rotate array by offset positions
	const rotated = [...newArray.slice(-offset), ...newArray.slice(0, -offset)];
	return rotated;
};

// Generate all characters in order
const numbers = Array.from("0123456789");
const letters = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
const symbols = Array.from("!@#$");
const allChars = [...numbers, ...letters, ...symbols];

// Add new type for completion actions
type CompletionAction = 'play_again' | 'create_password';

export default function MobiusGame({
	password,
	bearing,
	isTutorial = false,
	startingLevel = 6,
}: MobiusGameProps) {
	// Replace colors array to use CSS color values
	const colors = [
		bearing.up.color,    // Up color
		bearing.down.color,  // Down color
		bearing.left.color,  // Left color
		bearing.right.color, // Right color
	];

	// State to keep track of color offset
	const [colorOffset, setColorOffset] = useState(0);

	// Add state for dialog
	const [showDialog, setShowDialog] = useState(false);
	const [isGameStarted, setIsGameStarted] = useState(false);
	const [sequence, setSequence] = useState<string[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);

	// Add state for showing sequence
	const [showSequence, setShowSequence] = useState(false);

	// Update colorDirectionMap to use actual colors instead of Tailwind classes
	const colorDirectionMap = {
		[bearing.up.color]: "up",
		[bearing.down.color]: "down",
		[bearing.left.color]: "left",
		[bearing.right.color]: "right",
	};

	// Update gameLevel state to respect tutorial mode
	const [gameLevel, setGameLevel] = useState(
		// If it's a tutorial, always start at level 1, otherwise use startingLevel
		isTutorial ? 1 : Math.min(Math.max(startingLevel, 1), 6)
	);

	// Add state for shuffled characters
	const [shuffledChars, setShuffledChars] = useState(allChars);

	// Add new state for tracking confirmed guesses
	const [confirmedGuess, setConfirmedGuess] = useState<string[]>([]);

	// Add new state variables after other state declarations
	const [showResultDialog, setShowResultDialog] = useState(false);
	const [resultMessage, setResultMessage] = useState({
		title: "",
		description: "",
		status: "" as "success" | "error" | "",
	});

	// Add new state for completion dialog
	const [showCompletionDialog, setShowCompletionDialog] = useState(false);

	// Modified effect to stop color cycling when game starts
	useEffect(() => {
		if (isGameStarted) return;

		const interval = setInterval(() => {
			setColorOffset((prev) => (prev + 1) % colors.length);
			setShuffledChars((prev) => rotateArray(prev));
		}, 300);

		return () => clearInterval(interval);
	}, [isGameStarted]);

	// Effect to show dialog after 3 seconds
	useEffect(() => {
		const timer = setTimeout(() => {
			setShowDialog(true);
		}, 3000);

		return () => clearTimeout(timer);
	}, []);

	// Modified handleStartGame to show sequence with a delay
	const handleStartGame = () => {
		setIsGameStarted(true);
		setShowDialog(false);
		if (gameLevel >= 3) {
			setShuffledChars(rotateArray(allChars));
		}
		// Show sequence and controls after a short delay
		setTimeout(() => {
			setShowSequence(true);
		}, 200);
	};

	const mobius = password.split(""); // Split the text into array of characters

	// Update getCharacterColor to handle colors with opacity
	const getCharacterColor = (char: string, index: number) => {
		if (index < sequence.length) {
			return 'rgba(255, 255, 255, 0.7)';
		}

		if (gameLevel >= 2) {
			return 'rgba(156, 163, 175, 0.5)';
		}

		const charIndex = allChars.findIndex((c) => c === char);
		if (charIndex === -1) return 'rgba(52, 211, 153, 0.5)';
		
		const baseColor = colors[(charIndex + colorOffset) % colors.length];
		return addOpacityToColor(baseColor, 0.5);
	};

	// Helper function to add opacity to hex or rgb colors
	const addOpacityToColor = (color: string, opacity: number) => {
		// If color is already rgba, return as is
		if (color.startsWith('rgba')) return color;
		
		// If color is rgb, convert to rgba
		if (color.startsWith('rgb')) {
			return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
		}
		
		// If color is hex
		if (color.startsWith('#')) {
			const r = parseInt(color.slice(1, 3), 16);
			const g = parseInt(color.slice(3, 5), 16);
			const b = parseInt(color.slice(5, 7), 16);
			return `rgba(${r}, ${g}, ${b}, ${opacity})`;
		}
		
		return color;
	};

	// Add helper function to get the correct direction for a character
	const getCorrectDirection = (char: string) => {
		const charIndex = allChars.findIndex((c) => c === char);
		if (charIndex === -1) return null;

		const charColor = colors[(charIndex + colorOffset) % colors.length];
		return colorDirectionMap[charColor as keyof typeof colorDirectionMap];
	};

	// Modify handleDirectionClick to remove intermediate success dialog
	const handleDirectionClick = (direction: "up" | "down" | "left" | "right") => {
		if (!isGameStarted) return;

		if (gameLevel === 6) {
			// For level 6, map direction to character based on current color mapping
			let enteredChar = "";
			for (let i = 0; i < allChars.length; i++) {
				const char = allChars[i];
				const charColor = colors[(i + colorOffset) % colors.length];
				const mappedDirection =
					colorDirectionMap[
						charColor as keyof typeof colorDirectionMap
					];

				if (mappedDirection === direction) {
					enteredChar = char;
					break;
				}
			}

			if (enteredChar) {
				const newSequence = [...sequence, enteredChar];
				setSequence(newSequence);
				setCurrentIndex(currentIndex + 1);
				setColorOffset((prev) => (prev + 1) % colors.length);
				setShuffledChars(rotateArray(allChars));
			}
			return;
		}

		// Original logic for levels 1-5
		const currentChar = mobius[currentIndex];
		const charIndex = allChars.findIndex((c) => c === currentChar);
		const charColor =
			charIndex !== -1
				? colors[(charIndex + colorOffset) % colors.length]
				: null;
		const correctDirection = charColor
			? colorDirectionMap[charColor as keyof typeof colorDirectionMap]
			: null;

		if (direction === correctDirection) {
			const newSequence = [...sequence, currentChar];
			setSequence(newSequence);
			setCurrentIndex(currentIndex + 1);

			if (gameLevel >= 3) {
				setColorOffset((prev) => (prev + 1) % colors.length);
				setShuffledChars(rotateArray(allChars));
			}

			// Only show dialog when level is complete
			if (currentIndex === mobius.length - 1) {
				// Progress to next level immediately
				const nextLevel = Math.min(gameLevel + 1, 6);
				setGameLevel(nextLevel);
				
				// Reset game state
				setSequence([]);
				setCurrentIndex(0);
				setIsGameStarted(false);
				setShowDialog(true); // Show next level dialog
			}
		} else {
			// Wrong direction
			setSequence([]);
			setCurrentIndex(0);
			setResultMessage({
				title: "Incorrect Direction",
				description: "Wrong direction! Try again.",
				status: "error",
			});
			setShowResultDialog(true);

			setTimeout(() => {
				setShowResultDialog(false);
			}, 2000);
		}
	};

	// Modify handleConfirmGuess for level 6
	const handleConfirmGuess = () => {
		const correctDirections = mobius.map((char) => getCorrectDirection(char));
		const enteredDirections = sequence.map((char) => {
			const charIndex = allChars.findIndex((c) => c === char);
			const charColor = colors[(charIndex + colorOffset) % colors.length];
			return colorDirectionMap[charColor as keyof typeof colorDirectionMap];
		});

		const isCorrect = sequence.length === mobius.length && 
			correctDirections.every((dir, i) => dir === enteredDirections[i]);

		if (!isCorrect) {
			setSequence([]);
			setCurrentIndex(0);
			setConfirmedGuess([]);
			setResultMessage({
				title: "Incorrect Sequence",
				description: "Incorrect sequence! Try again from the beginning.",
				status: "error",
			});
			setShowResultDialog(true);

			setTimeout(() => {
				setShowResultDialog(false);
			}, 2000);
			return;
		}

		// For correct sequence in level 6, show completion dialog
		setSequence([]);
		setCurrentIndex(0);
		setIsGameStarted(false);
		setShowCompletionDialog(true);
	};

	// Add handler for completion actions
	const handleCompletionAction = (action: CompletionAction) => {
		setShowCompletionDialog(false);
		
		if (action === 'play_again') {
			setGameLevel(6);
			setShowDialog(true);
		} else {
			// Navigate to password creation page
			window.location.href = '/create';
		}
	};

	// Modify the Dialog content to show different messages for each level
	const dialogContent = {
		1: {
			title: "How to unlock me",
			description: `Colors unlock me! They are: up/${
				bearing.up.color
			} (${bearing.up.key.toUpperCase()}), 
				down/${bearing.down.color} (${bearing.down.key.toUpperCase()}), 
				left/${bearing.left.color} (${bearing.left.key.toUpperCase()}), 
				right/${bearing.right.color} (${bearing.right.key.toUpperCase()}).`,
			buttonText: "Start Level 1",
		},
		2: {
			title: "Colorless password",
			description:
				"The password now appears in gray - match the characters with their colored versions below!",
			buttonText: "Start Level 2",
		},
		3: {
			title: "Color rotation",
			description:
				"Colors will now rotate after each correct input. Stay focused on the changing patterns!",
			buttonText: "Start Level 3",
		},
		4: {
			title: "Position rotation",
			description:
				"Characters and colors will now rotate positions after each input!",
			buttonText: "Start Level 4",
		},
		5: {
			title: "Lose your bearings",
			description:
				"The directional buttons have lost their colors. I hope you remember the color bearings!",
			buttonText: "Start Level 5",
		},
		6: {
			title: "Can you master me?",
			description:
				"Final challenge! The password is now hidden. Remember both the password and the color bearings!",
			buttonText: "Start Ultimate Level",
		},
	};

	// Update getButtonClass to use inline styles
	const getButtonClass = (direction: string) => {
		const baseClass = "w-full aspect-square active:scale-95 transition-all duration-200";

		if (gameLevel === 5 || gameLevel === 6) {
			return `${baseClass} bg-opacity-5 hover:bg-opacity-10`;
		}

		const colorMap = {
			up: bearing.up.color,
			down: bearing.down.color,
			left: bearing.left.color,
			right: bearing.right.color,
		};

		return `${baseClass}`;
	};

	// Add keyboard event listener to use bearing keys
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (!isGameStarted || !showSequence) return;

			switch (e.key.toLowerCase()) {
				case bearing.up.key:
					handleDirectionClick("up");
					break;
				case bearing.down.key:
					handleDirectionClick("down");
					break;
				case bearing.left.key:
					handleDirectionClick("left");
					break;
				case bearing.right.key:
					handleDirectionClick("right");
					break;
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [isGameStarted, showSequence, currentIndex, bearing]);

	return (
		<div className="min-h-screen w-full bg-black flex items-center justify-center">
			<Dialog open={showDialog} onOpenChange={setShowDialog}>
				<DialogContent className="border-emerald-400/20 bg-black/40 w-[90%] max-w-2xl min-h-[250px] flex flex-col justify-between items-center p-8 rounded-lg">
					<DialogHeader className="space-y-6">
						<DialogTitle className="text-center text-emerald-400 text-3xl font-bold">
							{
								dialogContent[
									gameLevel as 1 | 2 | 3 | 4 | 5 | 6
								].title
							}
						</DialogTitle>
						<DialogDescription className="text-center text-emerald-400/70 text-lg leading-relaxed">
							{
								dialogContent[
									gameLevel as 1 | 2 | 3 | 4 | 5 | 6
								].description
							}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="mt-8 w-full">
						<Button
							onClick={handleStartGame}
							className="bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 text-lg px-8 py-6 w-full"
						>
							{
								dialogContent[
									gameLevel as 1 | 2 | 3 | 4 | 5 | 6
								].buttonText
							}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<div className="w-full flex flex-col items-center gap-3 sm:gap-5">
				{showSequence && gameLevel === 6 && (
					<motion.div
						initial={{opacity: 0, y: 10}}
						animate={{opacity: 1, y: 0}}
						className="mb-4"
					>
						<Button
							onClick={handleConfirmGuess}
							className="bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 
										 px-8 py-2 rounded-lg transition-all duration-200"
						>
							Check Password
						</Button>
					</motion.div>
				)}
				{/* Sequence boxes - only show when game started and sequence revealed */}
				{showSequence && (
					<motion.div
						initial={{opacity: 0, y: -20}}
						animate={{opacity: 1, y: 0}}
						className="flex gap-3 sm:gap-5 mb-4 sm:mb-8"
					>
						{gameLevel === 6
							? // For level 6, only show boxes based on sequence length plus one empty box
							  [...Array(sequence.length + 1)].map((_, i) => (
									<div
										key={i}
										style={{
											borderColor: i < sequence.length ? 'rgba(52, 211, 153, 0.4)' : 'rgba(52, 211, 153, 0.1)',
											backgroundColor: i < sequence.length ? 'rgba(52, 211, 153, 0.05)' : 'transparent'
										}}
										className={`
											w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border-2
											${i === currentIndex ? "ring-4 ring-white/30 scale-110" : ""}
											rounded-lg flex items-center justify-center 
											text-xl sm:text-2xl md:text-3xl font-bold
											transition-all duration-200
										`}
									>
										{i < sequence.length && (
											<motion.span
												initial={{scale: 0, opacity: 0}}
												animate={{scale: 1, opacity: 1}}
												transition={{duration: 0.2}}
												className="text-emerald-400"
											>
												*
											</motion.span>
										)}
									</div>
							  ))
							: mobius.map((char, i) => (
									<div
										key={i}
										style={{
											borderColor: i < sequence.length ? 'rgba(52, 211, 153, 0.4)' : 'rgba(52, 211, 153, 0.1)',
											backgroundColor: i < sequence.length ? 'rgba(52, 211, 153, 0.05)' : 'transparent',
											color: getCharacterColor(char, i)
										}}
										className={`
											w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border-2
											${i === currentIndex ? "ring-4 ring-white/30 scale-110" : ""}
											rounded-lg flex items-center justify-center 
											text-xl sm:text-2xl md:text-3xl font-bold
											transition-all duration-200
										`}
									>
										{i < sequence.length ? (
											<motion.span
												initial={{scale: 0, opacity: 0}}
												animate={{scale: 1, opacity: 1}}
												transition={{duration: 0.2}}
												className="text-emerald-400"
											>
												*
											</motion.span>
										) : (
											gameLevel !== 6 && char
										)}
									</div>
							  ))}
					</motion.div>
				)}

				{/* Characters grid - updated to use shuffledChars */}
				<div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 my-6">
					{(gameLevel >= 3 ? shuffledChars : allChars).map((char) => (
						<div
							key={char}
							style={{
								color: addOpacityToColor(
									colors[(allChars.findIndex((c) => c === char) + colorOffset) % colors.length],
									0.6 
								)
							}}
							className={`
								text-lg sm:text-2xl md:text-3xl lg:text-4xl
								font-bold flex items-center justify-center 
								py-2 sm:py-4 md:py-6 px-4 sm:px-6 md:px-8
								bg-white/5 rounded-lg shadow-lg 
								border border-white/10 
								transition-colors duration-500
							`}
						>
							{char}
						</div>
					))}
				</div>

				{/* Direction pad - only show when game started and sequence revealed */}
				{showSequence && (
					<motion.div
						initial={{opacity: 0, y: 20}}
						animate={{opacity: 1, y: 0}}
						className="grid grid-cols-3 gap-2 sm:gap-3 w-48 sm:w-56 md:w-64"
					>
						<div className="col-start-2">
							<Button
								variant="outline"
								onClick={() => handleDirectionClick("up")}
								style={{
									backgroundColor: gameLevel >= 5 
										? 'rgba(255, 255, 255, 0.03)'
										: addOpacityToColor(bearing.up.color, 0.1),
									borderColor: gameLevel >= 5 
										? 'rgba(255, 255, 255, 0.05)'
										: addOpacityToColor(bearing.up.color, 0.15),
								}}
								className={getButtonClass("up")}
							>
								<ArrowUp className="h-10 w-10 sm:h-10 sm:w-10 md:h-12 md:w-12 text-white/70" />
							</Button>
						</div>
						<div className="col-start-1 row-start-2">
							<Button
								variant="outline"
								onClick={() => handleDirectionClick("left")}
								style={{
									backgroundColor: gameLevel >= 5 
										? 'rgba(255, 255, 255, 0.05)' 
										: addOpacityToColor(bearing.left.color, 0.2),
									borderColor: gameLevel >= 5 
										? 'rgba(255, 255, 255, 0.1)' 
										: addOpacityToColor(bearing.left.color, 0.3),
								}}
								className={getButtonClass("left")}
							>
								<ArrowLeft className="h-10 w-10 sm:h-10 sm:w-10 md:h-12 md:w-12 text-white" />
							</Button>
						</div>
						<div className="col-start-3 row-start-2">
							<Button
								variant="outline"
								onClick={() => handleDirectionClick("right")}
								style={{
									backgroundColor: gameLevel >= 5 
										? 'rgba(255, 255, 255, 0.05)' 
										: addOpacityToColor(bearing.right.color, 0.2),
									borderColor: gameLevel >= 5 
										? 'rgba(255, 255, 255, 0.1)' 
										: addOpacityToColor(bearing.right.color, 0.3),
								}}
								className={getButtonClass("right")}
							>
								<ArrowRight className="h-10 w-10 sm:h-10 sm:w-10 md:h-12 md:w-12 text-white" />
							</Button>
						</div>
						<div className="col-start-2 row-start-3">
							<Button
								variant="outline"
								onClick={() => handleDirectionClick("down")}
								style={{
									backgroundColor: gameLevel >= 5 
										? 'rgba(255, 255, 255, 0.05)' 
										: addOpacityToColor(bearing.down.color, 0.2),
									borderColor: gameLevel >= 5 
										? 'rgba(255, 255, 255, 0.1)' 
										: addOpacityToColor(bearing.down.color, 0.3),
								}}
								className={getButtonClass("down")}
							>
								<ArrowDown className="h-10 w-10 sm:h-10 sm:w-10 md:h-12 md:w-12 text-white" />
							</Button>
						</div>
					</motion.div>
				)}
			</div>

			{/* Result Dialog */}
			<Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
				<DialogContent className="border-emerald-400/20 bg-black/40 w-[90%] max-w-2xl min-h-[200px] flex flex-col justify-between items-center p-8 rounded-lg">
					<DialogHeader className="space-y-6">
						<div className="flex flex-col items-center gap-4">
							{resultMessage.status === "success" ? (
								<CheckCircle className="w-16 h-16 text-emerald-400" />
							) : resultMessage.status === "error" ? (
								<XCircle className="w-16 h-16 text-red-400" />
							) : null}
							<DialogTitle className="text-center text-emerald-400 text-3xl font-bold">
								{resultMessage.title}
							</DialogTitle>
						</div>
						<DialogDescription className="text-center text-emerald-400/70 text-lg leading-relaxed">
							{resultMessage.description}
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>

			{/* Completion Dialog */}
			<Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
				<DialogContent className="border-emerald-400/20 bg-black/40 w-[90%] max-w-2xl min-h-[250px] flex flex-col justify-between items-center p-8 rounded-lg">
					<DialogHeader className="space-y-6">
						<div className="flex flex-col items-center gap-4">
							<CheckCircle className="w-16 h-16 text-emerald-400" />
							<DialogTitle className="text-center text-emerald-400 text-3xl font-bold">
								Congratulations!
							</DialogTitle>
						</div>
						<DialogDescription className="text-center text-emerald-400/70 text-lg leading-relaxed">
							You've truly mastered M@B1U5! What would you like to do next?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="mt-8 w-full flex flex-col sm:flex-row gap-4">
						<Button
							onClick={() => handleCompletionAction('play_again')}
							className="bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 
									 text-lg px-8 py-6 flex-1"
						>
							Play Again
						</Button>
						<Button
							onClick={() => handleCompletionAction('create_password')}
							className="bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 
									 text-lg px-8 py-6 flex-1"
						>
							Create Own Password
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
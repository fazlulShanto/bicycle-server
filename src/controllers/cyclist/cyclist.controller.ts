// import { Request, Response } from 'express';
// import bcrypt from 'bcrypt';

// import { SessionData } from '../../interfaces/session.interface';
// import { OTP } from '../../interfaces/account.interface';

// import { getSession, createSession, destroySession } from '../../middlewares/sessionManagement';
// import { sendOTP } from './mailer.controller';

// import {
//   addCyclistAddress,
//   addCyclistPlan,
//   createCyclist,
//   findCyclistByEmail,
//   updateCyclistPassconst saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);word,
// } from '../../models/cyclist/cyclist.query';

// import { getWeatherData } from '../../apis/weather.apis';

// let storedOTP: OTP | null = null;

// const signUp = async (req: Request, res: Response) => {
//   try {
//     const {
//       name,
//       email,
//       password,
//       phone,
//       role = 'cyclist',
//       plan = 'Basic',
//       homeAddress = '',
//       workAddress = '',
//     } = req.body;

//     if (await findCyclistByEmail(email)) {
//       return res.status(401).send('Email already exists!');
//     }

//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     const newCyclist = await createCyclist({
//       name,
//       email,
//       password: hashedPassword,
//       phone,
//       role,
//       plan,
//       homeAddress,
//       workAddress,
//     });

//     res.status(200).send(newCyclist);
//   } catch (error) {
//     res.status(500).send('Server Error!');
//   }
// };

// const signIn = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     const cyclist = await findCyclistByEmail(email);

//     if (!cyclist) {
//       res.status(400).send('There is no user with that email!');
//       return;
//     }

//     const isCredentialsOk = await bcrypt.compare(password, cyclist.password);

//     if (!isCredentialsOk) {
//       res.status(401).send('Invalid password!');
//       return;
//     }

//     const token = createSession(email);
//     res.cookie('accessToken', token, {
//       httpOnly: false,
//       secure: false,
//       sameSite: 'strict',
//     });

//     res.status(200).send({ accessToken: token });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Server Error!');
//   }
// };

// const forgotPassword = async (req: Request, res: Response) => {
//   try {
//     const { email } = req.body;

//     const cyclist = await findCyclistByEmail(email);

//     if (!cyclist) {
//       res.status(400).send('There is no user with that email!');
//       return;
//     }

//     const otp = Math.floor(Math.random() * 10000).toString();
//     storedOTP = { email, otp };

//     const { name } = cyclist;

//     await sendOTP(name, email, otp);

//     res.status(200).send('OTP has been sent to your email!');
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Server Error!');
//   }
// };

// const resetPassword = async (req: Request, res: Response) => {
//   try {
//     const { email, newPassword, otp } = req.body;

//     if (!storedOTP || storedOTP.email !== email || storedOTP.otp !== otp) {
//       res.status(400).send('Invalid OTP or email!');
//       return;
//     }

//     const cyclist = await findCyclistByEmail(email);

//     if (!cyclist) {
//       res.status(400).send('There is no user with that email!');
//       return;
//     }

//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

//     if (await updateCyclistPassword(email, hashedPassword)) {
//       storedOTP = null;
//       res.status(200).send('Password has been reset successfully!');
//       return;
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Server Error!');
//   }
// };

// const profile = async (req: Request, res: Response) => {
//   try {
//     const token = req.cookies.accessToken;
//     const session: SessionData | undefined = getSession(token);

//     if (session) {
//       const cyclist = await findCyclistByEmail(session.userEmail);
//       res.status(200).send(cyclist);
//       return;
//     }

//     res.status(401).send('Session is invalid.');
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Server Error!');
//   }
// };

// const signOut = async (req: Request, res: Response) => {
//   try {
//     const token = req.cookies.accessToken;
//     if (!destroySession(token)) {
//       res.status(400).send('No session to logout.');
//       return;
//     }

//     res.status(200).send('successfully logged out!');
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Server Error!');
//   }
// };

// const setUpAddress = async (req: Request, res: Response) => {
//   try {
//     const { homeAddress, workAddress } = req.body;

//     const token = req.cookies.accessToken;
//     const session: SessionData | undefined = getSession(token);

//     if (session) {
//       await addCyclistAddress(session.userEmail, homeAddress, workAddress);

//       res.status(200).send('Home address and work address added');
//       return;
//     }

//     res.status(401).send('Session is invalid.');
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Server Error!');
//   }
// };

// const setUpAddressEdit = async (req: Request, res: Response) => {
//   try {
//     const { homeAddress, workAddress } = req.body;

//     const token = req.cookies.accessToken;
//     const session: SessionData | undefined = getSession(token);

//     if (session) {
//       if (await addCyclistAddress(session.userEmail, homeAddress, workAddress)) {
//         res.status(200).send({ homeAddress, workAddress });
//         return;
//       }
//     }

//     res.status(401).send('Session is invalid.');
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Server Error!');
//   }
// };

// const weatherData = async (req: Request, res: Response) => {
//   try {
//     const { longitude, latitude } = req.body;

//     const weatherData = await getWeatherData(Number(longitude), Number(latitude));

//     res.status(200).send(weatherData);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Server Error!');
//   }
// };

// const cyclistName = async (req: Request, res: Response) => {
//   try {
//     const token = req.cookies.accessToken;
//     const session: SessionData | undefined = getSession(token);

//     if (session) {
//       const cyclist = await findCyclistByEmail(session.userEmail);
//       cyclist && res.status(200).send({ name: cyclist.name });
//       return;
//     }

//     res.status(401).send('Session is invalid.');
//   } catch (error) {
//     console.log(error);
//   }
// };

// const selectPlan = async (req: Request, res: Response) => {
//   console.log(req.body);
//   try {
//     const { plan } = req.body;

//     const token = req.cookies.accessToken;
//     const session: SessionData | undefined = getSession(token);

//     if (session && (await addCyclistPlan(session.userEmail, plan))) {
//       res.status(200).send({ plan });
//       return;
//     }

//     res.status(401).send('Session is invalid.');
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Server Error!');
//   }
// };

// export {
//   signUp,
//   signIn,
//   forgotPassword,
//   resetPassword,
//   profile,
//   signOut,
//   setUpAddress,
//   setUpAddressEdit,
//   weatherData,
//   cyclistName,
//   selectPlan,
// };

// new code fixes

import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { SessionData } from "../../interfaces/session.interface";
import { OTP } from "../../interfaces/account.interface";

import {
	getSession,
	createSession,
	destroySession,
	decodeJWT,
} from "../../middlewares/sessionManagement";
import { sendOTP } from "./mailer.controller";
import {
	addCyclistAddress,
	addCyclistPlan,
	createCyclist,
	findCyclistByEmail,
	updateCyclistPassword,
} from "../../models/cyclist/cyclist.query";
import { getWeatherData } from "../../apis/weather.apis";

let storedOTP: OTP | null = null;

const signUp = async (req: Request, res: Response) => {
	try {
		const {
			name,
			email,
			password,
			phone,
			role = "cyclist",
			plan = "Basic",
			homeAddress = "",
			workAddress = "",
		} = req.body;

		if (await findCyclistByEmail(email)) {
			return res.status(401).send("Email already exists!");
		}

		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		const newCyclist = await createCyclist({
			name,
			email,
			password: hashedPassword,
			phone,
			role,
			plan,
			homeAddress,
			workAddress,
		});

		res.status(200).send(newCyclist);
	} catch (error) {
		res.status(500).send("Server Error!");
	}
};

const signIn = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		// console.log(email,password)

		const cyclist = await findCyclistByEmail(email);

		const homeAddress  = cyclist?.homeAddress.length ? true  : false ;

		if (!cyclist) {
			return res.status(400).send("There is no user with that email!");
			
		}

		const isCredentialsOk = await bcrypt.compare(
			password,
			cyclist.password
		);

		if (!isCredentialsOk) {
			return res.status(401).send("Invalid password!");
			
		}
		const token = createSession(email);
		return	res.status(200).send({ accessToken: token,profile : cyclist,old : homeAddress });
	} catch (error) {
		console.log(`signin controller:`,error);
		return res.status(500).send("Server Error!");
	}
};

const forgotPassword = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;

		const cyclist = await findCyclistByEmail(email);

		if (!cyclist) {
			res.status(400).send("There is no user with that email!");
			return;
		}

		const otp = Math.floor(Math.random() * 10000).toString();
		storedOTP = { email, otp };

		const { name } = cyclist;

		await sendOTP(name, email, otp);

		res.status(200).send("OTP has been sent to your email!");
	} catch (error) {
		console.log(error);
		res.status(500).send("Server Error!");
	}
};

const resetPassword = async (req: Request, res: Response) => {
	try {
		const { email, newPassword, otp } = req.body;

		if (!storedOTP || storedOTP.email !== email || storedOTP.otp !== otp) {
			res.status(400).send("Invalid OTP or email!");
			return;
		}

		const cyclist = await findCyclistByEmail(email);

		if (!cyclist) {
			res.status(400).send("There is no user with that email!");
			return;
		}

		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

		if (await updateCyclistPassword(email, hashedPassword)) {
			storedOTP = null;
			res.status(200).send("Password has been reset successfully!");
			return;
		}
	} catch (error) {
		console.log(error);
		res.status(500).send("Server Error!");
	}
};

const profile = async (req: Request, res: Response) => {

	// console.log('in profile',req.headers);
	try {
		// const token = req.cookies.accessToken;

		// const session: SessionData | undefined = getSession(token);

		// console.log(req.headers);

		const session = req.body._email;
		// console.log(session);

		// if (session) {
		if (session) 
		{
			const cyclist = await findCyclistByEmail(session);
			res.status(200).send(cyclist);
			return;
		}
		return	res.status(401).send("Session is invalid.");
	} catch (error) {
		console.log(error);
		res.status(500).send("Server Error!");
	}
};

const signOut = async (req: Request, res: Response) => {
	try {
		const token = req.cookies.accessToken;
		if (!destroySession(token)) {
			res.status(400).send("No session to logout.");
			return;
		}

		res.status(200).send("successfully logged out!");
	} catch (error) {
		console.log(error);
		res.status(500).send("Server Error!");
	}
};

const setUpAddress = async (req: Request, res: Response) => {

	// console.log(req);
	try {
		const { homeAddress, workAddress } = req.body;

		const token = req.cookies.accessToken;
		// const session: SessionData | undefined = getSession(token);
		const session= true;

		if (session) {
			await addCyclistAddress(
				// session.userEmail,
				req.body._email,
				homeAddress,
				workAddress
			);

			res.status(200).send("Home address and work address added");
			return;
		}

		res.status(401).send("Session is invalid.");
	} catch (error) {
		console.log(error);
		res.status(500).send("Server Error!");
	}
};

const setUpAddressEdit = async (req: Request, res: Response) => {
	try {
		const { homeAddress, workAddress } = req.body;

		const token = req.cookies.accessToken;
		const session: SessionData | undefined = getSession(token);

		if (session) {
			if (
				await addCyclistAddress(
					session.userEmail,
					homeAddress,
					workAddress
				)
			) {
				res.status(200).send({ homeAddress, workAddress });
				return;
			}
		}

		res.status(401).send("Session is invalid.");
	} catch (error) {
		console.log(error);
		res.status(500).send("Server Error!");
	}
};

const weatherData = async (req: Request, res: Response) => {
	try {
		const { longitude, latitude } = req.body;

		const weatherData = await getWeatherData(
			Number(longitude),
			Number(latitude)
		);

		res.status(200).send(weatherData);
	} catch (error) {
		console.log(error);
		res.status(500).send("Server Error!");
	}
};

const cyclistName = async (req: Request, res: Response) => {
	try {
		const token = req.cookies.accessToken;
		const session: SessionData | undefined = getSession(token);

		if (session) {
			const cyclist = await findCyclistByEmail(session.userEmail);
			cyclist && res.status(200).send({ name: cyclist.name });
			return;
		}

		res.status(401).send("Session is invalid.");
	} catch (error) {
		console.log(error);
	}
};

const selectPlan = async (req: Request, res: Response) => {
	console.log(req.body);
	try {
		const { plan } = req.body;

		// const token = req.cookies.accessToken;
		// const session: SessionData | undefined = getSession(token);
		const session = req.body._email;

		if (session && (await addCyclistPlan(session, plan))) {
			res.status(200).send({ plan });
			return;
		}

		res.status(401).send("Session is invalid.");
	} catch (error) {
		console.log(error);
		res.status(500).send("Server Error!");
	}
};

export {
	signUp,
	signIn,
	forgotPassword,
	resetPassword,
	profile,
	signOut,
	setUpAddress,
	setUpAddressEdit,
	weatherData,
	cyclistName,
	selectPlan,
};

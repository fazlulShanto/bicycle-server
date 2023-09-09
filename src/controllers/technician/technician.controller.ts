import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { SessionData } from '../../interfaces/session.interface';
import { OTP } from '../../interfaces/account.interface';
import { getSession, createSession, destroySession } from '../../middlewares/sessionManagement';
import { sendOTP } from './mailer.controller';
import {
  addTechnicianDetails,
  createTechnician,
  findAvailableSupportTimeForCyclist,
  findSubpartTechnician,
  findTechnicianByEmail,
  findTechnicianById,
  updateTechnicianPassword,
} from '../../models/technician/technician.query';
import { Types } from '../../models/database';
import { findCyclistByEmail } from '../../models/cyclist/cyclist.query';
import { TechnicianModel } from '../../models/technician/technician.model';

let storedOTP: OTP | null = null;

const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role = 'technician' } = req.body;

    if (await findTechnicianByEmail(email)) {
      return res.status(401).send('Email already exists!');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newTechnician = await createTechnician({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // res.status(200).send(newTechnician);
    const token = createSession(email);
    res.cookie('accessToken', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'strict',
    });

    return res.status(200).send({ accessToken: token });
  } catch (error) {
    res.status(500).send('Server Error!');
  }
};

const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const technician = await findTechnicianByEmail(email);

    if (!technician) {
      res.status(400).send('There is no Technician with that email!');
      return;
    }

    const isCredentialsOk = await bcrypt.compare(password, technician.password);

    if (!isCredentialsOk) {
      res.status(401).send('Invalid password!');
      return;
    }

    const token = createSession(email);
    res.cookie('accessToken', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'strict',
    });

    res.status(200).send({ accessToken: token });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error!');
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const technician = await findTechnicianByEmail(email);

    if (!technician) {
      res.status(400).send('There is no Technician with that email!');
      return;
    }

    const otp = Math.floor(Math.random() * 10000).toString();
    storedOTP = { email, otp };

    const { name } = technician;

    await sendOTP(name, email, otp);

    res.status(200).send('OTP has been sent to your email!');
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error!');
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword, otp } = req.body;

    if (!storedOTP || storedOTP.email !== email || storedOTP.otp !== otp) {
      res.status(400).send('Invalid OTP or email!');
      return;
    }

    const technician = await findTechnicianByEmail(email);

    if (!technician) {
      res.status(400).send('There is no Technician with that email!');
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await updateTechnicianPassword(email, hashedPassword);
    storedOTP = null;

    res.status(200).send('Password has been reset successfully!');
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error!');
  }
};

const profile = async (req: Request, res: Response) => {
  try {
    // const token = req.cookies.accessToken;
    // const session: SessionData | undefined = getSession(token);
    const session= { userEmail : req.body._email };

    if (session) {
      const technician = await findTechnicianByEmail(session.userEmail);
      res.status(200).send(technician);
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error!');
  }
};

const signOut = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.accessToken;
    if (!destroySession(token)) {
      res.status(400).send('No session to logout.');
      return;
    }

    res.status(200).send('successfully logged out!');
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error!');
  }
};

const setUpTechnician = async (req: Request, res: Response) => {
  try {
    const {
      imageUrl,
      address,
      phone,
      brandsExpertise,
      subpartExpertise,
      workingDays,
      workingSlots,
    } = req.body;
    const setTechnician = {
      imageUrl,
      address,
      phone,
      brandsExpertise,
      subpartExpertise,
      workingDays,
      workingSlots,
    };

    // const token = req.cookies.accessToken;
    // const session: SessionData | undefined = getSession(token);
    const session= { userEmail : req.body._email };
    if (session) {
      console.log(subpartExpertise);
      const newTechnician = await addTechnicianDetails(session.userEmail, setTechnician);
      if (!newTechnician) res.status(401).send('Setting up technician failed!');
      res.status(201).send(newTechnician);
      return;
    }

    res.status(401).send('Technician not Found!');
  } catch (error) {
    console.error('Could not set up technician!');
    res.status(500).send('Server Error !');
  }
};

const editProfile = async (req: Request, res: Response) => {
  try {
    const {
      imageUrl,
      address,
      phone,
      brandsExpertise,
      subpartExpertise,
      workingDays,
      workingSlots,
    } = req.body;
    const technician = {
      imageUrl,
      address,
      phone,
      brandsExpertise,
      subpartExpertise,
      workingDays,
      workingSlots,
    };

    // const token = req.cookies.accessToken;
    // const session: SessionData | undefined = getSession(token);
    const session= { userEmail : req.body._email };
    if (session) {
      const updatedTechnician = await addTechnicianDetails(session.userEmail, technician);
      if (!updatedTechnician) {
        res.status(401).send('Setting up technician failed!');
        return;
      }

      res.status(201).send(updatedTechnician);
      return;
    }
  } catch (error) {
    console.error('Failed to edit technician!');
    res.status(500).send('Server Error !');
  }
};

const findSubpartExpart = async (req: Request, res: Response) => {
  try {
    const { subparts } = req.body;

    const technicians: any = await findSubpartTechnician(subparts);

    if (technicians) {
      res.status(200).send(technicians);
      return;
    }
  } catch (error) {
    console.error('Failed to get subpart technician!');
    res.status(500).send('Server Error !');
  }
};

const availableSupportTime = async (req: Request, res: Response) => {
  try {
    const { subparts } = req.body;

    console.log('$$$$$$$$=',req.body);

    // const token = req.cookies.accessToken;
    // const session: SessionData | undefined = getSession(token);
    const session: SessionData | Boolean = true;

    if (session) {
      const cyclist = await findCyclistByEmail(req.body._email);

      if (!cyclist) {
        return res.status(404).send('Cyclist not found.');
      }

      const technician = await findSubpartTechnician(subparts);

      if (technician?._id && technician) {
        const slots = await findAvailableSupportTimeForCyclist(String(technician._id));

        res.status(200).send({ technician: technician, slots });
        return;
      } else {
        const technician = await TechnicianModel.find({});

        if (technician[0]) {
          const slots = await findAvailableSupportTimeForCyclist(String(technician[0]._id));

          res.status(200).send({ technician: technician[0], slots });
          return;
        } else {
          res.status(200).send('No technician found');
          return;
        }
      }
    }
    return res.status(401).send('Unauthorized NPC');
  } catch (error) {
    console.error('Server Error!', error);
    res.status(501).send('Server Error!');
  }
};

export {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
  profile,
  signOut,
  setUpTechnician,
  editProfile,
  findSubpartExpart,
  availableSupportTime,
};

const Subject = require('../models/subjectSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Student = require('../models/studentSchema.js');

// Create Subject
const subjectCreate = async (req, res) => {
    try {
        const subjects = req.body.subjects?.map(subject => ({
            subName: subject.subName,
            subCode: subject.subCode,
        })) || [];

        if (subjects.length === 0) {
            return res.status(400).send({ message: 'Subjects array is required.' });
        }

        // Check if subCode already exists in the same school
        const existingSubject = await Subject.findOne({
            subCode: subjects[0].subCode,
            school: req.body.adminID,
        });

        if (existingSubject) {
            return res.send({ message: 'Sorry, this subCode must be unique as it already exists' });
        }

        const newSubjects = subjects.map(subject => ({
            ...subject,
            sclassName: req.body.sclassName,
            school: req.body.adminID,
        }));

        const result = await Subject.insertMany(newSubjects);
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get all subjects by school ID
const allSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ school: req.params.id })
            .populate("sclassName", "sclassName");

        if (subjects.length > 0) {
            res.send(subjects);
        } else {
            res.send({ message: "No subjects found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get subjects by class ID
const classSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ sclassName: req.params.id });

        if (subjects.length > 0) {
            res.send(subjects);
        } else {
            res.send({ message: "No subjects found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get subjects in a class that are not assigned to any teacher
const freeSubjectList = async (req, res) => {
    try {
        const subjects = await Subject.find({
            sclassName: req.params.id,
            teacher: { $exists: false }
        });

        if (subjects.length > 0) {
            res.send(subjects);
        } else {
            res.send({ message: "No subjects found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get subject detail with populated class and teacher
const getSubjectDetail = async (req, res) => {
    try {
        let subject = await Subject.findById(req.params.id);

        if (!subject) {
            return res.send({ message: "No subject found" });
        }

        subject = await subject.populate("sclassName", "sclassName");
        subject = await subject.populate("teacher", "name");

        res.send(subject);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Delete a single subject
const deleteSubject = async (req, res) => {
    try {
        const deletedSubject = await Subject.findByIdAndDelete(req.params.id);

        if (!deletedSubject) {
            return res.send({ message: "Subject not found" });
        }

        // Remove from teacher
        await Teacher.updateOne(
            { teachSubject: deletedSubject._id },
            { $unset: { teachSubject: "" } }
        );

        // Remove from student examResult and attendance
        await Student.updateMany(
            {},
            {
                $pull: {
                    examResult: { subName: deletedSubject._id },
                    attendance: { subName: deletedSubject._id },
                }
            }
        );

        res.send(deletedSubject);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Delete all subjects for a school
const deleteSubjects = async (req, res) => {
    try {
        const subjectsToDelete = await Subject.find({ school: req.params.id });
        const subjectIds = subjectsToDelete.map(subject => subject._id);

        await Subject.deleteMany({ _id: { $in: subjectIds } });

        await Teacher.updateMany(
            { teachSubject: { $in: subjectIds } },
            { $unset: { teachSubject: "" } }
        );

        await Student.updateMany(
            {},
            {
                $pull: {
                    examResult: { subName: { $in: subjectIds } },
                    attendance: { subName: { $in: subjectIds } }
                }
            }
        );

        res.send({ message: "Subjects deleted", deletedCount: subjectIds.length });
    } catch (error) {
        res.status(500).json(error);
    }
};

// Delete all subjects for a specific class
const deleteSubjectsByClass = async (req, res) => {
    try {
        const subjectsToDelete = await Subject.find({ sclassName: req.params.id });
        const subjectIds = subjectsToDelete.map(subject => subject._id);

        await Subject.deleteMany({ _id: { $in: subjectIds } });

        await Teacher.updateMany(
            { teachSubject: { $in: subjectIds } },
            { $unset: { teachSubject: "" } }
        );

        await Student.updateMany(
            {},
            {
                $pull: {
                    examResult: { subName: { $in: subjectIds } },
                    attendance: { subName: { $in: subjectIds } }
                }
            }
        );

        res.send({ message: "Class subjects deleted", deletedCount: subjectIds.length });
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    subjectCreate,
    freeSubjectList,
    classSubjects,
    getSubjectDetail,
    deleteSubjectsByClass,
    deleteSubjects,
    deleteSubject,
    allSubjects
};
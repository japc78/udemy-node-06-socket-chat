const { request, response } = require("express")

const isAdminRole = (req = request, res = response, next) => {

    if (!req.user) {
        return res.status(500).json({ msg: 'Is necessary to valid the toke first'});
    }

    const { role, name } = req.user;

    if (role !== 'ADMIN_ROLE') return res.status(401).json({ msg: `The user: ${name} has not Admin role` });

    next();
}


const shouldBeRole = ( ...roles ) => {
    return (req = request, res = response, next) => {
        if (!req.user) {
            return res.status(500).json({ msg: 'Is necessary to valid the toke first'});
        }

        const { role, name } = req.user;
        if (!roles.includes(role)) return res.status(401).json({ msg: `The user: ${name} has not authorized role. it Should have: ${roles}` });
        next();
    }
}

module.exports = {
    isAdminRole,
    shouldBeRole
}
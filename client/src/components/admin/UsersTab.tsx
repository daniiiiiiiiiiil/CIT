import type { User } from "../../types/admin.types";

interface UsersTabProps {
    users: User[];
    onToggleAdmin: (userId: number, isAdmin: boolean) => void;
    onDeleteUser: (userId: number, userName: string) => void;
}

export function UsersTab({ users, onToggleAdmin, onDeleteUser }: UsersTabProps) {
    return (
        <div className="adm-table-wrap">
            <table className="adm-table">
                <thead>
                <tr>
                    <th>ID</th><th>Имя</th><th>Email</th>
                    <th>Роль</th><th>Дата</th><th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td className="adm-table__id">#{user.id}</td>
                        <td className="adm-table__name">{user.name}</td>
                        <td className="adm-table__email">{user.email}</td>
                        <td>
                                <span className={`adm-role ${user.is_admin ? "adm-role--admin" : "adm-role--user"}`}>
                                    {user.is_admin ? "⬡ Админ" : "◉ Польз."}
                                </span>
                        </td>
                        <td className="adm-table__date">{new Date(user.created_at).toLocaleDateString("ru-RU")}</td>
                        <td>
                            <div className="adm-table__actions">
                                <button className="adm-btn-sm" onClick={() => onToggleAdmin(user.id, user.is_admin)}>
                                    {user.is_admin ? "↓ Снять" : "↑ Админ"}
                                </button>
                                <button className="adm-btn-sm adm-btn-sm--del" onClick={() => onDeleteUser(user.id, user.name)}>
                                    ✕
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
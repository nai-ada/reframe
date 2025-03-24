// const BASE_URL = "/supabase";

// export const fetchTable = {
//   from: (tableName) => ({
//     select: (columns = "*") => ({
//       eq: async (column, value) => {
//         try {
//           const response = await fetch(
//             `${BASE_URL}/rest/v1/${tableName}?select=${columns}&${column}=eq.${value}`,
//             {
//               headers: {
//                 "Content-Type": "application/json",
//                 Prefer: "return=representation",
//               },
//             }
//           );
//           const data = await response.json();
//           return { data, error: null };
//         } catch (error) {
//           return { data: null, error };
//         }
//       },
//       single: async () => {
//         try {
//           const response = await fetch(
//             `${BASE_URL}/rest/v1/${tableName}?select=${columns}&limit=1`,
//             {
//               headers: {
//                 "Content-Type": "application/json",
//                 Prefer: "return=representation",
//               },
//             }
//           );
//           const data = await response.json();
//           return { data: data[0], error: null };
//         } catch (error) {
//           return { data: null, error };
//         }
//       },
//     }),
//     delete: () => ({
//       eq: async (column, value) => {
//         try {
//           const response = await fetch(
//             `${BASE_URL}/rest/v1/${tableName}?${column}=eq.${value}`,
//             {
//               method: "DELETE",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//             }
//           );
//           return { error: null };
//         } catch (error) {
//           return { error };
//         }
//       },
//     }),
//   }),
// };

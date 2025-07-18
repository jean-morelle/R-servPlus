using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RéservPlus.Domain.Models
{
    public enum ReservationStatut
    {
        EnAttente,
        Confirmee,
        Annulee,
        Terminee,
        Refusee
    }
}

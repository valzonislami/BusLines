// File: Mappings/AutoMapperProfile.cs

using AutoMapper;
using server.DTOs;
using server.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace server.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDTO>().ReverseMap(); 
        }
    }
}
